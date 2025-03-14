
import express from 'express' 
import { addProfilePic } from '../controllers/profilePicController.js'
import authenticate from '../middleware/authenticate.js'
const profilePicRouter = express.Router()
profilePicRouter.post("/add-profilePic",authenticate, addProfilePic)

export default profilePicRouter