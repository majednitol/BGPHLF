
import express from 'express' 
import { addPrescription, deletePrescription } from '../controllers/prescriptionController.js';
import authenticate from '../middleware/authenticate.js';


const prescriptionRouter = express.Router()
prescriptionRouter.post("/add-prescription",authenticate, addPrescription)
prescriptionRouter.post('/delete-prescription',authenticate, deletePrescription);

export default prescriptionRouter