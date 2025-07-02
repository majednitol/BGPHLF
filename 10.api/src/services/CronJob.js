// import axios from "axios";
// import cron from "node-cron";
// import { smartContract } from "./smartContract.js";

// const RIRS = [
//   { id: "afrinic", url: "https://ftp.afrinic.net/pub/stats/afrinic/delegated-afrinic-extended-latest" },
//   { id: "apnic",   url: "https://ftp.apnic.net/stats/apnic/delegated-apnic-extended-latest" },
//   { id: "arin",    url: "https://ftp.arin.net/pub/stats/arin/delegated-arin-extended-latest" },
//   { id: "lacnic",  url: "https://ftp.lacnic.net/pub/stats/lacnic/delegated-lacnic-extended-latest" },
//   { id: "ripencc", url: "https://ftp.ripe.net/pub/stats/ripencc/delegated-ripencc-extended-latest" },
// ];

// const requestQueue = [];

// function getPrefixLength(value) {
//   const num = Number(value);
//   if (!Number.isInteger(num) || num <= 0 || num > 4294967296) return 32;
//   const prefixLength = 32 - Math.log2(num);
//   return Number.isInteger(prefixLength) ? prefixLength : Math.floor(prefixLength);
// }

// async function processRIRData(rir) {
//   try {
//     console.log(`📥 Fetching data from ${rir.id.toUpperCase()}...`);
//     const response = await axios.get(rir.url);
//     const lines = response.data.split("\n");

//     const countryAsnMap = {};
//     const countryAsnIndex = {};
//     const timestamp = new Date().toISOString();

//     for (const line of lines) {
//       if (line.startsWith("#") || line.trim() === "") continue;
//       const parts = line.split("|");
//       if (parts.length < 7) continue;
//       const [, country, type, start] = parts;

//       if (type === "asn") {
//         if (!countryAsnMap[country]) {
//           countryAsnMap[country] = [];
//           countryAsnIndex[country] = 0;
//         }
//         countryAsnMap[country].push(start);
//       }
//     }

//     for (const line of lines) {
//       if (line.startsWith("#") || line.trim() === "") continue;
//       const parts = line.split("|");
//       if (parts.length < 7) continue;

//       const [assignedBy, assignedTo, type, start, value] = parts;
//       if (type !== "ipv4") continue;

//       const prefixLength = getPrefixLength(value);
//       const prefix = `${start}/${prefixLength}`;
//       const asns = countryAsnMap[assignedTo] || [];

//       if (asns.length === 0) continue;

//       const index = countryAsnIndex[assignedTo] % asns.length;
//       const asn = asns[index];
//       countryAsnIndex[assignedTo]++;

//       requestQueue.push({ prefix, asn, assignedTo, assignedBy, timestamp });
//     }

//     console.log(`✅ ${rir.id.toUpperCase()}: Queued ${requestQueue.length} records`);
//   } catch (err) {
//     console.error(`❌ Failed to process ${rir.id.toUpperCase()}: ${err.message}`);
//   }
// }

// async function processQueue() {
//   const contract = await smartContract(
//     {
//       org: "AfrinicMSP",
//       channelName: "mychannel",
//       chaincodeName: "basic"
//     },
//     "200"
//   );

//   let success = 0;
//   let fail = 0;

//   while (requestQueue.length > 0) {
//     const { asn, prefix, assignedTo, assignedBy, timestamp } = requestQueue.shift();
//     try {
//       const prefixJSON = JSON.stringify([prefix]);
//       const result = await contract.submitTransaction(
//         "SetASData",
//         asn,
//         prefixJSON,
//         assignedTo,
//         assignedBy,
//         timestamp
//       );
//         console.log(result.toString())
//       console.log(`✅ Stored ASN ${asn} → ${prefix}`);
//        console.log(`📊 Finished queue processing: ${success} succeeded, ${fail} failed`);
//       success++;
//     } catch (err) {
//       console.error(`⚠️ Failed to store ASN ${asn}, prefix ${prefix}: ${err.message}`);
//       fail++;
//     }
//   }

//   console.log(`📊 Finished queue processing: ${success} succeeded, ${fail} failed`);
// }

// let isRunning = false;

// export function scheduleRIRJob() {
//   cron.schedule("* * * * *", async () => { 
//     if (isRunning) {
//       console.warn("⏳ Skipping — previous job still running");
//       return;
//     }

//     isRunning = true;
//     console.log("⏳ Starting scheduled RIR import job...");

//     try {
//       await Promise.all(RIRS.map(rir => processRIRData(rir)));
//       await processQueue();
//       console.log("✅ All RIRs processed successfully");
//     } catch (err) {
//       console.error("❌ Error during RIR processing:", err.message);
//     } finally {
//       isRunning = false;
//     }
//   });
// }

// // Call only this once to start scheduling
// // scheduleRIRJob();

// // import axios from "axios";
// // import cron from "node-cron";
// // import { smartContract } from "./smartContract.js";
// // // import { smartContract } from "./smartContract";
// // function getPrefixLength(value) {
// //     const num = Number(value);
// //     if (!Number.isInteger(num) || num <= 0 || num > 4294967296) return 32;
// //     const prefixLength = 32 - Math.log2(num);
// //     return Number.isInteger(prefixLength) ? prefixLength : Math.floor(prefixLength);
// // }
// // const requestQueue = [];

// // export async function SetASData() {
// //     try {
// //         const rir = "afrinic";
// //         const url = `https://ftp.afrinic.net/pub/stats/${rir}/delegated-${rir}-extended-latest`;
// //         const response = await axios.get(url);
// //         const lines = response.data.split("\n");

// //         const countryAsnMap = {};
// //         const countryAsnIndex = {};
// //         const timestamp = new Date().toISOString();

// //         // Step 1: Collect ASN by country
// //         for (const line of lines) {
// //             if (line.startsWith("#") || line.trim() === "") continue;
// //             const parts = line.split("|");
// //             if (parts.length < 7) continue;
// //             const [, country, type, start] = parts;

// //             if (type === "asn") {
// //                 if (!countryAsnMap[country]) {
// //                     countryAsnMap[country] = [];
// //                     countryAsnIndex[country] = 0;
// //                 }
// //                 countryAsnMap[country].push(start);
// //             }
// //         }

// //         // Step 2: Match prefixes with ASNs by country
// //         for (const line of lines) {
// //             if (line.startsWith("#") || line.trim() === "") continue;
// //             const parts = line.split("|");
// //             if (parts.length < 7) continue;

// //             const [assignedBy, assignedTo, type, start, value, , status] = parts;
// //             if (type !== "ipv4") continue;

// //             const prefixLength = getPrefixLength(value);
// //             const prefix = `${start}/${prefixLength}`;
// //             const asns = countryAsnMap[assignedTo] || [];
// //             if (asns.length === 0) continue;

// //             const index = countryAsnIndex[assignedTo] % asns.length;
// //             const asn = asns[index];
// //             countryAsnIndex[assignedTo]++;

// //             requestQueue.push({
// //                 prefix,
// //                 asn,
// //                 assignedTo,
// //                 assignedBy,
// //                 timestamp,
// //             });
// //         }

// //         console.log(`📦 Queued ${requestQueue.length} prefix-ASN records...`);
// //         await processQueue();

// //     } catch (error) {
// //         console.error("❌ Error fetching or processing RIR data:", error.message);
// //     }
// // }

// // // 🔁 Queue processor: handles one transaction at a time
// // async function processQueue() {
// //     const contract = await smartContract(
// //         {
// //             org: "AfrinicMSP",
// //             channelName: "mychannel",
// //             chaincodeName: "basic"
// //         },
// //         "200" // admin user ID
// //     );
// //     let successCount = 0;
// //     let failureCount = 0;
// //     while (requestQueue.length > 0) {
// //         const { asn, prefix, assignedTo, assignedBy, timestamp } = requestQueue.shift();
// //         try {
// //             const prefixJSON = JSON.stringify([prefix]);
// //             const result = await contract.submitTransaction(
// //                 "SetASData",
// //                 asn,
// //                 prefixJSON,
// //                 assignedTo,
// //                 assignedBy,
// //                 timestamp
// //             );
// //        console.log("result",result.toString())
// //             console.log(`✅ Stored ASN ${asn} → ${prefix}`);
// //             successCount++;
// //         } catch (error) {
// //             console.error(`⚠️ Failed to store ASN ${asn}, prefix ${prefix}: ${error.message}`);
// //             failureCount++;
// //         }
// //     }
// //      console.log(`📊 Queue processing summary: ${successCount} succeeded, ${failureCount} failed.`);
// // }

// // let isRunning = false; 
// // export function scheduleRIRJob() {
// //     cron.schedule("* * * * *", async () => {
// //         if (isRunning) {
// //             console.warn("⏳ Previous RIR import is still running. Skipping this round...");
// //             return;
// //         }

// //         isRunning = true;
// //         console.log("⏳ Starting scheduled RIR import...");

// //         try {
// //             await SetASData();
// //             console.log("✅ RIR import complete");
// //         } catch (err) {
// //             console.error("❌ Error during RIR import:", err.message);
// //         } finally {
// //             isRunning = false; 
// //         }
// //     });
// // }



// // scheduleRIRJob();
