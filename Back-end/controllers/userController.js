import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const getUserData = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
        profileImage: user.profileImage, 
        email:user.email
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.files?.profileImage;

    if (!file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    // Validate image MIME type
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Please upload an image.' });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'profileImages',
      width: 300,
      crop: 'scale',
    });

    const userId = req.user?.id || req.body.userId;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Profile image uploaded!', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;  // 👈 Get userId from request body

    const user = await userModel.findById(userId);
    if (!user || !user.profileImage) {
      return res.status(400).json({ success: false, message: 'No profile image to remove.' });
    }

    user.profileImage = '';
    await user.save();

    res.status(200).json({ success: true, message: 'Profile image removed.', user });
  } catch (error) {
    console.error("Error removing profile image:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


