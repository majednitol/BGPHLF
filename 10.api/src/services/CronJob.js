import fs from "fs";
import path from "path";
import Papa from "papaparse";
import { smartContract } from "./smartContract.js";
import cron from "node-cron";

const requestQueue = [];
 
async function processRIRDataFromCSV(filePath) {
  try {
    console.log(`📥 Reading CSV file: ${filePath}`);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const result = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const timestamp = new Date().toISOString();

    for (const item of result.data) {
      const { asn, prefix, assignBy, assignedTo } = item;
      if (!asn || !prefix || !assignBy || !assignedTo) {
        console.warn("⚠️ Skipping incomplete record:", item);
        continue;
      }
 
      requestQueue.push({ asn, prefix, assignedBy: assignBy, assignedTo, timestamp });
    }

    console.log(`✅ Queued ${requestQueue.length} records from CSV`);
  } catch (err) {
    console.error(`❌ Failed to process CSV file: ${err.message}`);
  }
}

async function processQueue() {
  const contract = await smartContract(
    {
      org: "AfrinicMSP",
      channelName: "mychannel",
      chaincodeName: "basic"
    },
    "222"
  );

  let success = 0;
  let fail = 0;

  while (requestQueue.length > 0) {
    const { asn, prefix, assignedTo, assignedBy, timestamp } = requestQueue.shift();
    try {
      const prefixJSON = JSON.stringify([prefix]);
      console.log(asn, prefixJSON, assignedTo, assignedBy, timestamp)
      const result = await contract.submitTransaction(
        "SetASData",
        asn,
        prefixJSON,
        assignedTo,
        assignedBy,
        timestamp
      );
      console.log(result.toString());
      console.log(`✅ Stored ASN ${asn} → ${prefix}`);
      console.log(asn, prefix, assignedTo, assignedBy, timestamp)
      success++;
    } catch (err) {
      console.error(`⚠️ Failed to store ASN ${asn}, prefix ${prefix}: ${err.message}`);
      fail++;
    }
  }

  console.log(`📊 Finished queue processing: ${success} succeeded, ${fail} failed`);
}

let isRunning = false;

export function scheduleRIRJob() {
  cron.schedule("* * * * *", async () => {
    if (isRunning) {
      console.warn("⏳ Skipping — previous job still running");
      return;
    }

    isRunning = true;
    console.log("⏳ Starting scheduled CSV import job...");

    try {
      const filePath = path.resolve(__dirname, "data", "sample_roa_dataset.csv");
      await processRIRDataFromCSV(filePath);
      await processQueue();
    } catch (err) {
      console.error("❌ Error during CSV job:", err.message);
    } finally {
      isRunning = false;
    }
  });
}
 