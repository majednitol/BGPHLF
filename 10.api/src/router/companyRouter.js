
import express from 'express' 

import authenticate from '../middleware/authenticate.js';
import { getCompany, registerCompany, registerCompanyWithMember } from '../controllers/companyController.js';
const companyRouter = express.Router()
companyRouter.post("/register-company-by-member", registerCompanyWithMember)
companyRouter.get('/get-company', getCompany);

export default companyRouter