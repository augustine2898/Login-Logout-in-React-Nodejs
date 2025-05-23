import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import transpoter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js';



export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {

        const exisitingUser = await userModel.findOne({ email });
        if (exisitingUser) {
            return res.json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });



        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        //sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to my website",
            text: `Welcome to my Website.Your account has been created with email id:${email}`
        }

        await transpoter.sendMail(mailOptions)

        return res.json({ success: true, message: "User registered Successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body;
    

    if (!email||!password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' })
        }

        if (user.role !== 'user') {
            return res.json({ success: false, message: 'Access denied: Not a user account' });
          }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Login Successfull" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//send Verification OTP to User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Acoount Verification OTP",
            html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transpoter.sendMail(mailOption);
        res.json({ success: true, message: "Verification OTP Sent on Email" });
    } catch (error) {
        console.log("otp:",error)
        res.json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: 'Email verified successfully' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//check if user is authenticated
// export const isAuthenticated = async (req, res) => {
//     try {

//         return res.json({ success: true });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

export const isAuthenticated = async (req, res) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
  };

//send password reset otp


export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return re.json({ success: false, message: error.message });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: true, message: "User Not Found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExprieAt = Date.now() + 15 * 60 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            // text: `Your OTP for resetting your password is ${otp}.Use this OTP to proceed with resetting your password.`,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }
        await transpoter.sendMail(mailOption);

        return res.json({ success: true, message: 'OTP sent to your email' })

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Reset User password 
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email,OTP,newPassword is required' })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.restOtp === "" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp ='';
        user.resetOtpExpireAt=0;

        await user.save();

        return res.json({success:true,message:'Password has been reset successfully '})

    } catch (error) {
       return res.json({ success: false, message: error.message });
    }
}