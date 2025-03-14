import { setProfilePic } from "../services/profilePicService.js";


const chaincodeName = "basic";
const channelName = "mychannel"
export async function addProfilePic(req, res) {
    try {
        let payload = {
            "org": req.body.org,
            "channelName": channelName,
            "chaincodeName": chaincodeName,
            "url": req.body.url,
            "userId":req.userId

        }
        console.log("payload", payload)
        let result = await setProfilePic(payload);
        console.log(result)
        res.send(result)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
}