import { GetCompany, RegisterCompany } from "../services/companyService.js";
const chaincodeName = "basic";
const channelName = "mychannel"
export async function registerCompany(req, res) {
    try {

        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.body.comapanyID
                ? req.body.comapanyID : req.comapanyID,
            "companyName": req.body.companyName,
            "rir": req.body.rir,
            "metadata": req.body.metadata
        }
        console.log("payload", payload)
        let result = await RegisterCompany(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}

export async function getCompany(req, res) {
    try {
        let payload = {
            "org": req.query.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "comapanyID": req.query.comapanyID ? req.query.comapanyID : req.comapanyID
        }
        console.log("payload", payload)
        let result = await GetCompany(payload);
        console.log("result app", result)
        res.json(result)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

