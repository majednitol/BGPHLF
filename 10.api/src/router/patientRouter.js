
import express from 'express' 
import { acceptByPatient, AddPatientPersonalData, createPatientAccount, getDisease, getPendingRequestedUser, patientData, patientDataFromDoctor, patientDataFromPathologist, revokeAccessDataByPatient, shareDataByPatient } from '../controllers/patientController.js';
import authenticate from '../middleware/authenticate.js';
const patientRouter = express.Router()
patientRouter.post("/create-patient-account", createPatientAccount)
patientRouter.get('/getPatientData', authenticate, patientData);
patientRouter.get('/get-diseases', authenticate, getDisease);
patientRouter.get('/get-pending-requested-user',authenticate, getPendingRequestedUser);
patientRouter.post('/add-patient-personal-data', authenticate,AddPatientPersonalData);
patientRouter.get("/data-from-doctor", authenticate, patientDataFromDoctor)
patientRouter.get("/data-from-pathologist", authenticate, patientDataFromPathologist)
patientRouter.post("/share-data-by-patient", authenticate, shareDataByPatient)
patientRouter.post("/accept-by-patient", authenticate, acceptByPatient)
revokeAccessDataByPatient
patientRouter.post("/revoke-access-data",authenticate, revokeAccessDataByPatient)

export default patientRouter