import axios from 'axios';
import fs from 'fs';
import cron from 'node-cron';
import Ajv from 'ajv';

const API_BASE = process.env.API_BASE || 'http://api.default.svc.cluster.local:4000';
const ROA_FILE = process.env.ROA_FILE || '/data/roas.json';

const prefixes = ['10.1.0.0/24', '192.168.0.0/24', '172.16.0.0/16'];
const asns = [100, 200, 300];

const ajv = new Ajv();

// ✅ Correct schema with object counts
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

// ✅ Validate JSON against schema
function validateROA(data) {
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    console.error('[FATAL] Invalid ROA format:', validate.errors);
    process.exit(1);
  }
}

async function refreshROAs() {
  const roas = [];

  for (const prefix of prefixes) {
    for (const asn of asns) {
      try {
        const res = await axios.get(`${API_BASE}/api/validateAsnPrefix`, {
          params: { asn, prefix }
        });

        if (res.data === 'valid') {
          roas.push({
            prefix,
            maxLength: Number(prefix.split('/')[1]),
            asn: `AS${asn}`
          });
        }
      } catch (err) {
        console.error(`Validation error for ASN ${asn}, Prefix ${prefix}:`, err.message);
      }
    }
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
}

refreshROAs();
cron.schedule('*/10 * * * *', refreshROAs);
