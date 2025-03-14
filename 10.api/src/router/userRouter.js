import express from 'express' 
import { connectedAccountType, loginUser, registerNewUser } from '../controllers/userController.js';
import authenticate from '../middleware/authenticate.js';
const userRouter = express.Router()
userRouter.get('/user-type', connectedAccountType);
userRouter.post("/register", registerNewUser)
userRouter.post("/login-user", loginUser)
export default userRouter