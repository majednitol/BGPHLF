import axios from 'axios';
import fs from 'fs';
import cron from 'node-cron';
import Ajv from 'ajv';
import { exec } from 'child_process';

const API_BASE = process.env.API_BASE || 'http://api.default.svc.cluster.local:4000';
const ROA_FILE = process.env.ROA_FILE || '/app/data/roas.json';

const ajv = new Ajv();
const schema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        generated: { type: "integer" },
        counts: { type: "integer" }
      },
      required: ["generated", "counts"]
    },
    roas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          prefix: { type: "string" },
          maxLength: { type: "integer" },
          asn: { type: "integer" } 
        },
        required: ["prefix", "maxLength", "asn"]
      }
    }
  },
  required: ["metadata", "roas"]
};

function validateROA(data) {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error('[FATAL] Invalid ROA format:', validate.errors);
    process.exit(1);
  }
}

function signROA() {
  return new Promise((resolve, reject) => {
    exec('./sign-roa.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('[Signer] Error signing ROA:', error);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn('[Signer] Signing stderr:', stderr);
      }
      console.log('[Signer] Signing output:', stdout);
      resolve();
    });
  });
}

async function refreshROAs() {
  console.log('[RONO] Starting ROA refresh...');
  const roas = [];

  try {
    const { data } = await axios.get(`${API_BASE}/ip/get-all-as-data`);
    console.log("data",data)
    for (const entry of data) {
       const asn = entry.asn.trim();

      for (const prefix of entry.prefix) {
        console.log("prefix", prefix)
        console.log("entry.prefix", entry.prefix)
        try {
          const res = await axios.get(`${API_BASE}/ip/trace-prefix`, {
            params: { prefix, asn: asn }
          });

          const status = res.data;
          console.log(`${prefix} - AS${asnNum}: ${status}`);

          if (status === 'valid') {
            roas.push({
              prefix,
              maxLength: Number(prefix.split('/')[1]),
              asn: asnNum
            });
          }
        } catch (err) {
          console.error(`[ERROR] Validation failed for ${prefix} - AS${asnNum}:`, err.message);
        }
      }
    }
  } catch (err) {
    console.error(`[FATAL] Failed to fetch ASN data: ${err.message}`);
    return;
  }

  if (roas.length === 0) {
    console.warn('[WARN] No valid ROAs found. Skipping signing.');
    return;
  }

  const roaData = {
    metadata: {
      generated: Math.floor(Date.now() / 1000),
      counts: roas.length
    },
    roas
  };

  validateROA(roaData);
  fs.writeFileSync(ROA_FILE, JSON.stringify(roaData, null, 2));
  console.log(`[RONO] Wrote ${roas.length} ROAs to ${ROA_FILE}: [${roas.map(r => r.prefix).join(', ')}]`);

  await signROA();
  console.log('[RONO] ROA signing complete.');
}

// Run once at start and then every 10 minutes
(async () => {
  await refreshROAs();
  cron.schedule('*/10 * * * *', refreshROAs);
})();
