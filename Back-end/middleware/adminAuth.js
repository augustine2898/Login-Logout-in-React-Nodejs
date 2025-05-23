import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const isAdminAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: Not an admin' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};
