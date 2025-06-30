import axios from "axios";
import cron from "node-cron";
import { smartContract } from "./smartContract.js";
// import { smartContract } from "./smartContract";
function getPrefixLength(value) {
    const num = Number(value);
    if (!Number.isInteger(num) || num <= 0 || num > 4294967296) return 32;
    const prefixLength = 32 - Math.log2(num);
    return Number.isInteger(prefixLength) ? prefixLength : Math.floor(prefixLength);
}
const requestQueue = [];

export async function SetASData() {
    try {
        const rir = "afrinic";
        const url = `https://ftp.afrinic.net/pub/stats/${rir}/delegated-${rir}-extended-latest`;
        const response = await axios.get(url);
        const lines = response.data.split("\n");

        const countryAsnMap = {};
        const countryAsnIndex = {};
        const timestamp = new Date().toISOString();

        // Step 1: Collect ASN by country
        for (const line of lines) {
            if (line.startsWith("#") || line.trim() === "") continue;
            const parts = line.split("|");
            if (parts.length < 7) continue;
            const [, country, type, start] = parts;

            if (type === "asn") {
                if (!countryAsnMap[country]) {
                    countryAsnMap[country] = [];
                    countryAsnIndex[country] = 0;
                }
                countryAsnMap[country].push(start);
            }
        }

        // Step 2: Match prefixes with ASNs by country
        for (const line of lines) {
            if (line.startsWith("#") || line.trim() === "") continue;
            const parts = line.split("|");
            if (parts.length < 7) continue;

            const [assignedBy, assignedTo, type, start, value, , status] = parts;
            if (type !== "ipv4") continue;

            const prefixLength = getPrefixLength(value);
            const prefix = `${start}/${prefixLength}`;
            const asns = countryAsnMap[assignedTo] || [];
            if (asns.length === 0) continue;

            const index = countryAsnIndex[assignedTo] % asns.length;
            const asn = asns[index];
            countryAsnIndex[assignedTo]++;

            requestQueue.push({
                prefix,
                asn,
                assignedTo,
                assignedBy,
                timestamp,
            });
        }

        console.log(`📦 Queued ${requestQueue.length} prefix-ASN records...`);
        await processQueue();

    } catch (error) {
        console.error("❌ Error fetching or processing RIR data:", error.message);
    }
}

// 🔁 Queue processor: handles one transaction at a time
async function processQueue() {
    const contract = await smartContract(
        {
            org: "AfrinicMSP",
            channelName: "mychannel",
            chaincodeName: "basic"
        },
        "200" // admin user ID
    );
    let successCount = 0;
    let failureCount = 0;
    while (requestQueue.length > 0) {
        const { asn, prefix, assignedTo, assignedBy, timestamp } = requestQueue.shift();
        try {
            const prefixJSON = JSON.stringify([prefix]);
            const result = await contract.submitTransaction(
                "SetASData",
                asn,
                prefixJSON,
                assignedTo,
                assignedBy,
                timestamp
            );
       console.log("result",result.toString())
            console.log(`✅ Stored ASN ${asn} → ${prefix}`);
            successCount++;
        } catch (error) {
            console.error(`⚠️ Failed to store ASN ${asn}, prefix ${prefix}: ${error.message}`);
            failureCount++;
        }
    }
     console.log(`📊 Queue processing summary: ${successCount} succeeded, ${failureCount} failed.`);
}

let isRunning = false; 
export function scheduleRIRJob() {
    cron.schedule("* * * * *", async () => {
        if (isRunning) {
            console.warn("⏳ Previous RIR import is still running. Skipping this round...");
            return;
        }

        isRunning = true;
        console.log("⏳ Starting scheduled RIR import...");

        try {
            await SetASData();
            console.log("✅ RIR import complete");
        } catch (err) {
            console.error("❌ Error during RIR import:", err.message);
        } finally {
            isRunning = false; 
        }
    });
}



scheduleRIRJob();
