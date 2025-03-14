
import express from 'express' 
import { createPathologistAccount, pathologistData, pathologistDataFromDoctor, pathologistDataToDoctor } from '../controllers/pathologistController.js';
import authenticate from '../middleware/authenticate.js';
const pathologistRouter = express.Router()
pathologistRouter.post("/create-pathologist-account", createPathologistAccount)
pathologistRouter.get('/getPathologistData',authenticate, pathologistData);
pathologistRouter.get("/data-from-doctor", authenticate, pathologistDataFromDoctor)
pathologistRouter.get("/data-to-doctor",authenticate,pathologistDataToDoctor)

export default pathologistRouter