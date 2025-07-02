import axios from 'axios';
import fs from 'fs';
import cron from 'node-cron';
import Ajv from 'ajv';
import { exec } from 'child_process';

const API_BASE = process.env.API_BASE || 'http://api.default.svc.cluster.local:4000';
const ROA_FILE = process.env.ROA_FILE || '/data/roas.json';

const prefixASNList = [
  { prefix: '103.108.202.0/23', asn: 132000 },
  { prefix: '103.144.125.0/24', asn: 132001 },
  { prefix: '103.148.241.0/24', asn: 132058 }
];

const ajv = new Ajv();
const schema = {
  type: "object",
  properties: {
    metadata: {
      type: "object",
      properties: {
        generated: { type: "integer" },
        counts: {
          type: "object",
          properties: {
            ipv4: { type: "integer" },
            ipv6: { type: "integer" }
          },
          required: ["ipv4", "ipv6"]
        }
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
          asn: { type: "string" }
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

  for (const { prefix, asn } of prefixASNList) {
    try {
      const res = await axios.get(`${API_BASE}/ip/trace-prefix`, {
        params: { prefix, asn }
      });

      const status = res.data;
      console.log(`${prefix} - AS${asn}: ${status}`);

      if (status === 'valid') {
        roas.push({
          prefix,
          maxLength: Number(prefix.split('/')[1]),
          asn: `AS${asn}`
        });
      }

    } catch (err) {
      console.error(`[ERROR] Validation failed for ${prefix} - AS${asn}:`, err.message);
    }
  }

  if (roas.length === 0) {
    console.warn('[WARN] No valid ROAs found. Skipping signing.');
    return;
  }

  const roaData = {
    metadata: {
      generated: Math.floor(Date.now() / 1000),
      counts: {
        ipv4: roas.length,
        ipv6: 0
      }
    },
    roas
  };

  validateROA(roaData);
  fs.writeFileSync(ROA_FILE, JSON.stringify(roaData, null, 2));
  console.log(`[RONO] Wrote ${roas.length} ROAs to ${ROA_FILE}`);

  await signROA();
  console.log('[RONO] ROA signing complete.');
}

// Start once at launch
(async () => {
  await refreshROAs();
  cron.schedule('*/10 * * * *', refreshROAs); // every 10 minutes
})();
