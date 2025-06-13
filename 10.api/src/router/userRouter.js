import express from 'express' 
import {  createSystemManager, createUser, getAllPrefixesAssignedByOrg, getLoggedInUser, getSystemManager, getUser, loginSystemManager, loginUser, registerNewUser } from '../controllers/userController.js';
const userRouter = express.Router()
userRouter.get('/get-user', getUser);
userRouter.get('/get-user', getUser);
userRouter.get('/get-system-manager', getSystemManager);
// loginSystemManager
userRouter.post("/login-system-manager", loginSystemManager)
userRouter.post("/create-system-manager", createSystemManager)
userRouter.post("/loggin-user", getLoggedInUser)
userRouter.get("/get-all-prefixes-assigned-by-org", getAllPrefixesAssignedByOrg)
userRouter.post("/register", registerNewUser)
userRouter.post("/create-user", createUser)
userRouter.post("/login-user", loginUser)
export default userRouter