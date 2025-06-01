import express from 'express' 
import {  createSystemManager, createUser, getAllPrefixesAssignedByRONO, getLoggedInUser, getSystemManager, getUser, loginUser, registerNewUser } from '../controllers/userController.js';
const userRouter = express.Router()
userRouter.get('/get-user', getUser);
userRouter.get('/get-user', getUser);
userRouter.get('/get-system-manager', getSystemManager);
userRouter.post("/create-system-manager", createSystemManager)
userRouter.post("/loggin-user", getLoggedInUser)
userRouter.get("/get-all-prefixes-assigned-by-rono", getAllPrefixesAssignedByRONO)
userRouter.post("/register", registerNewUser)
userRouter.post("/create-user", createUser)
userRouter.post("/login-user", loginUser)
export default userRouter