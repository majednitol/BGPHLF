import express from "express";
const app = express();
;
import cors from 'cors';
import doctorRouter from "./router/doctorRouter.js";
import patientRouter from "./router/patientRouter.js";
import adminRouter from "./router/adminRouter.js";
import pathologistRouter from "./router/pathologistRouter.js";
import medicalResearchLabRouter from "./router/medicalResearchLabRouter.js";
import pharmacyCompanyRouter from "./router/pharmacyCompanyRouter.js";
import prescriptionRouter from "./router/prescriptionRouter.js";
import profilePicRouter from "./router/profilePicRouter.js";
import userRouter from "./router/userRouter.js";
import dataRouter from "./router/dataRouter.js";
import gobalErrorHander from "./middleware/gobalErrorHander.js";
app.use(cors())
app.use(express.json());

app.use('/doctor', doctorRouter);
app.use("/patient", patientRouter)
app.use('/admin', adminRouter)
app.use("/pathologist", pathologistRouter)
app.use("/medicalResearchLab", medicalResearchLabRouter)
app.use("/pharmacyCompany", pharmacyCompanyRouter)
app.use("/prescription", prescriptionRouter)
app.use("/profilePic", profilePicRouter)
app.use("/user", userRouter)
app.use("/data", dataRouter)
app.use(gobalErrorHander)

app.listen(4000, () => {
    console.log("server started");

})




