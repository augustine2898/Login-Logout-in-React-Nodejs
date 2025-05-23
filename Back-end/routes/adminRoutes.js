import express from 'express';
import {
  adminLogin,
  adminLogout,
  getAllUsers,
  searchUsers,
  updateUser,
  deleteUser,
  createUser,
  isAdminAuthenticatedController,
} from '../controllers/adminController.js';

import { isAdminAuthenticated } from '../middleware/adminAuth.js';

const router = express.Router();

// Admin login/logout
router.post('/login', adminLogin);
router.post('/logout', adminLogout);
router.get('/is-authenticated', isAdminAuthenticatedController);


// All routes below this are protected by admin auth
router.use(isAdminAuthenticated);

// User management
router.get('/users',getAllUsers);
router.get('/users/search', searchUsers);
router.post('/users/create', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
