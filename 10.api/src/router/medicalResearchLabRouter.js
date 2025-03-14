
import express from 'express' 
import { addDisease, addLabReport, createMedicalResearchLabAccount, getPendingRequesterUser, medicalResearchLabData, requestPatientData } from '../controllers/medicalResearchLabController.js';
import authenticate from '../middleware/authenticate.js';

const medicalResearchLabRouter = express.Router()
medicalResearchLabRouter.post("/create-medicalResearchLab-account", createMedicalResearchLabAccount)
medicalResearchLabRouter.get('/getMedicalResearchLabData', authenticate, medicalResearchLabData);
medicalResearchLabRouter.post('/request-patient-data', authenticate, requestPatientData)

medicalResearchLabRouter.get('/get-pending-requester-user', authenticate, getPendingRequesterUser);
medicalResearchLabRouter.post('/add-disease', authenticate, addDisease);
medicalResearchLabRouter.post('/add-lab-report', authenticate, addLabReport);
export default medicalResearchLabRouter