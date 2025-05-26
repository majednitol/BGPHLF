
import express from 'express' 

import authenticate from '../middleware/authenticate.js';
import { getCompany, registerCompany } from '../controllers/companyController.js';
const companyRouter = express.Router()
companyRouter.post("/register-company", registerCompany)
companyRouter.get('/get-company', getCompany);

export default companyRouter