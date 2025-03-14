
import express from 'express'
import { addTopMedicine, createPharmacyCompanyAccount, getDisease, getPendingRequesterUser, pharmacyCompanyData, requestPatientData } from '../controllers/pharmacyCompanyController.js';

import authenticate from '../middleware/authenticate.js';
const pharmacyCompanyRouter = express.Router()
pharmacyCompanyRouter.post("/create-pharmacyCompany-account", createPharmacyCompanyAccount)
pharmacyCompanyRouter.post("/add-top-medicine", authenticate, addTopMedicine)
pharmacyCompanyRouter.get('/getPharmacyCompanyData', authenticate, pharmacyCompanyData);
pharmacyCompanyRouter.get('/get-diseases', authenticate, getDisease);
pharmacyCompanyRouter.get('/get-pending-requester-user', authenticate, getPendingRequesterUser);
pharmacyCompanyRouter.post('/request-patient-data', authenticate, requestPatientData)
export default pharmacyCompanyRouter