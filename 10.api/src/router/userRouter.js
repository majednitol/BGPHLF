import express from 'express' 
import {  createUser, getUser, loginUser, registerNewUser } from '../controllers/userController.js';
const userRouter = express.Router()
userRouter.get('/get-user', getUser);
userRouter.post("/register", registerNewUser)
userRouter.post("/create-user", createUser)
userRouter.post("/login-user", loginUser)
export default userRouter