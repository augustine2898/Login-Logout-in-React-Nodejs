import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData, removeProfileImage, uploadProfileImage} from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);

userRouter.put('/profile-picture/:userId',userAuth,uploadProfileImage)
userRouter.post('/upload-profile', userAuth, uploadProfileImage);
userRouter.delete('/remove-profile', userAuth, removeProfileImage);

export default userRouter;
