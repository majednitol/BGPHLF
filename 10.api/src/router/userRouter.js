import express from 'express' 
import {  createSystemManager, createUser, getLoggedInUser, getSystemManager, getUser, loginUser, registerNewUser } from '../controllers/userController.js';
const userRouter = express.Router()
userRouter.get('/get-user', getUser);
userRouter.get('/get-user', getUser);
userRouter.get('/get-system-manager', getSystemManager);
userRouter.post("/create-system-manager", createSystemManager)
userRouter.post("/loggin-user", getLoggedInUser)

userRouter.post("/register", registerNewUser)
userRouter.post("/create-user", createUser)
userRouter.post("/login-user", loginUser)
export default userRouter