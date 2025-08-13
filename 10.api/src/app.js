import express from "express";
const app = express();
;
import cors from 'cors';
import userRouter from "./router/userRouter.js";
import gobalErrorHander from "./middleware/gobalErrorHander.js";

import ipPrefixRouter from "./router/ipPrefixRouter.js";
import companyRouter from "./router/companyRouter.js";
import { scheduleRIRJob } from "./services/CronJob.js";

app.use(cors())
app.use(express.json());

app.use('/ip', ipPrefixRouter);
app.use("/user", userRouter)
app.use("/company", companyRouter)
app.use(gobalErrorHander)
scheduleRIRJob();
app.listen(4000, () => {
    console.log("server started");

})




