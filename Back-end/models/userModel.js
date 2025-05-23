import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyOtp:{type:String,default:''},
    verifyOtpExpireAt:{type:Number,default:0},
    isAccountVerified:{type:Boolean,default:false},
    resetOtp:{type:String,default:''},
    resetOtpExprieAt:{type:Number,default:0},
    profileImage: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },

    
})

const userModel = mongoose.model.User || mongoose.model('User',userSchema);


export default userModel;