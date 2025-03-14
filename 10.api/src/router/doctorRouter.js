
import express from 'express' 
import { createDoctorAccount, doctorData, doctorDataFromPathologist, doctorDataToPathologist, doctorDataToPatient } from '../controllers/doctorController.js';
import authenticate from '../middleware/authenticate.js';
const doctorRouter = express.Router()
doctorRouter.post("/create-doctor-account", createDoctorAccount)
doctorRouter.get('/getDoctorData',authenticate, doctorData);
doctorRouter.get('/data-from-pathologist', authenticate, doctorDataFromPathologist);
doctorRouter.get('/data-to-pathologist', authenticate, doctorDataToPathologist);
doctorRouter.get('/data-to-patient',authenticate, doctorDataToPatient);

export default doctorRouter