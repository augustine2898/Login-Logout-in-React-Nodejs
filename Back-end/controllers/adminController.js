import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

// Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: 'Email and password are required' });
  }

  try {
    const admin = await userModel.findOne({ email, role: 'admin' });

    if (!admin) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: 'Admin logged in successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.json({ success: true, message: 'Admin logged out' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// Check if admin is authenticated
export const isAdminAuthenticatedController = async (req, res) => {
  const token = req.cookies.adminToken;

  if (!token) return res.status(401).json({ success: false, message: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await userModel.findById(decoded.id);

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};


// Get All Users
export const getAllUsers = async (req, res) => {
  console.log("🔥 getAllUsers controller triggered");
  try {
    const users = await userModel.find({role:'user'});
    console.log(users)
    return res.json({ success: true, users });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Search Users
export const searchUsers = async (req, res) => {
  const { query } = req.query;
  console.log(query)
  try {
    const users = await userModel.find({
      role: 'user',
      $or: [
        { name: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
      ],
    }).select('-password');

    return res.json({ success: true, users });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Edit User
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, profileImage } = req.body;

  try {
    const user = await userModel.findByIdAndUpdate(
      id,
      { name, email, profileImage },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Create User (By Admin)
export const createUser = async (req, res) => {
    const { name, email, password, profileImage } = req.body;
  
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Name, email, and password are required' });
    }
  
    try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.json({ success: false, message: 'User already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
        profileImage,
        role: 'user',
      });
  
      await newUser.save();
  
      return res.json({ success: true, message: 'User created successfully', user: newUser });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
  