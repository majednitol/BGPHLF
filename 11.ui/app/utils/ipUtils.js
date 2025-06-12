import { Netmask } from 'netmask';

// Utility functions
function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

function intToIp(int) {
  return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
}

function overlaps(a, b) {
  const aStart = ipToInt(a.base);
  const aEnd = ipToInt(a.broadcast);
  const bStart = ipToInt(b.base);
  const bEnd = ipToInt(b.broadcast);
  return !(bEnd < aStart || bStart > aEnd);
}

function generateSubnets(baseCidr, newPrefix) {
  const base = new Netmask(baseCidr);
  const baseStart = ipToInt(base.base);
  const baseEnd = ipToInt(base.broadcast);
  const basePrefix = base.bitmask;

  if (newPrefix < basePrefix) {
    throw new Error("Not enough space in parent prefix");
  }

  const blockSize = 2 ** (32 - newPrefix);
  const subnets = [];

  for (let i = baseStart; i + blockSize - 1 <= baseEnd; i += blockSize) {
    if (i % blockSize === 0) {
      const cidr = `${intToIp(i)}/${newPrefix}`;
      subnets.push(new Netmask(cidr));
    }
  }

  return subnets;
}

// ✅ Option 1: Single smallest block that fits requiredIPs
function calculateSingleBlock(parentPrefix, requiredIPs, alreadyAllocated = []) {
  const allocatedBlocks = alreadyAllocated.map(block => new Netmask(block));

  for (let prefix = 32; prefix >= 0; prefix--) {
    const size = 2 ** (32 - prefix);
    if (size >= requiredIPs + 2) { // +2 for network and broadcast
      const candidates = generateSubnets(parentPrefix, prefix);
      for (const candidate of candidates) {
        const hasConflict = allocatedBlocks.some(alloc => overlaps(candidate, alloc));
        if (!hasConflict) {
          return [candidate.toString()];
        }
      }
    }
  }
  return null;
}

// ✅ Option 2: Allocate multiple max-length blocks (e.g., /24s)
export function calculateMultipleSubnets(parentPrefix, requiredIPs, maxLength = 24, alreadyAllocated = []) {
  const maxBlockSize = 2 ** (32 - maxLength);
  const blocksNeeded = Math.ceil(requiredIPs / maxBlockSize);
  const candidates = generateSubnets(parentPrefix, maxLength);
  const allocatedBlocks = alreadyAllocated.map(block => new Netmask(block));

  const selected = [];

  for (const candidate of candidates) {
    const hasConflict = allocatedBlocks.some(alloc => overlaps(candidate, alloc));
    if (!hasConflict) {
      selected.push(candidate.toString());
      allocatedBlocks.push(candidate);
    }
    if (selected.length === blocksNeeded) break;
  }

  return selected.length === blocksNeeded ? selected : null;
}

 export default function calculateSubnets(payload) {
  const {
    requestedIPs,
    preferSingleBlock,
    poolCIDR,
    maxLength = 24,
    alreadyAllocated = []
  } = payload;
console.log("payload768",payload)
  const allocator = preferSingleBlock
    ? (parentPrefix, requiredIPs, alreadyAllocated = []) =>
        calculateSingleBlock(parentPrefix, requiredIPs, alreadyAllocated)
    : (parentPrefix, requiredIPs, maxLength = 24, alreadyAllocated = []) =>
        calculateMultipleSubnets(parentPrefix, requiredIPs, maxLength, alreadyAllocated);

  const result = preferSingleBlock
    ? allocator(poolCIDR, requestedIPs, alreadyAllocated)
    : allocator(poolCIDR, requestedIPs, maxLength, alreadyAllocated);

  return result;
}

// import { Netmask } from 'netmask';

// function ipToInt(ip) {
//   return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
// }

// function intToIp(int) {
//   return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
// }


// function ipCountToPrefix(requiredIPs) {
//   if (requiredIPs <= 0) throw new Error('Required IPs must be greater than zero');
//   let total = 1;
//   while (total < requiredIPs + 2) total *= 2;
//   return 32 - Math.log2(total);
// }


// function overlaps(a, b) {
//   const aStart = ipToInt(a.base);
//   const aEnd = ipToInt(a.broadcast);
//   const bStart = ipToInt(b.base);
//   const bEnd = ipToInt(b.broadcast);
//   return !(bEnd < aStart || bStart > aEnd);
// }


// function generateSubnets(baseCidr, newPrefix) {
//   const base = new Netmask(baseCidr);
//   const baseStart = ipToInt(base.base);
//   const baseEnd = ipToInt(base.broadcast);
//   const basePrefix = base.bitmask; 
//     if (newPrefix < basePrefix) {
//     throw new Error("Not enough space in parent prefix");
//   }
//   const blockSize = 2 ** (32 - newPrefix);
//   const subnets = [];

//   for (let i = baseStart; i + blockSize - 1 <= baseEnd; i += blockSize) {
//     if (i % blockSize === 0) {
//       const cidr = `${intToIp(i)}/${newPrefix}`;
//       subnets.push(new Netmask(cidr));
//     }
//   }

//   return subnets;
// }


// export function calculateSubnets(parentPrefix, requiredIPs, alreadyAllocated = []) {
//   console.log("requiredIPs",requiredIPs)
//   const requiredPrefix = ipCountToPrefix(requiredIPs);
//   const candidates = generateSubnets(parentPrefix, requiredPrefix);

//   const allocatedBlocks = alreadyAllocated.map(block => new Netmask(block));

//   for (const candidate of candidates) {
//     const hasConflict = allocatedBlocks.some(alloc => overlaps(candidate, alloc));
//     if (!hasConflict) {
//       console.log("candidate",candidate)
//       return candidate.toString();
//     }
//   }

//   return null; // No available subnet found
// }

// import { Netmask } from 'netmask';

// function ipToInt(ip) {
//   return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
// }

// function intToIp(int) {
//   return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
// }

// function ipCountToPrefix(requiredIPs) {
//   let total = 1;
//   while (total < requiredIPs + 2) total *= 2; 
//   return 32 - Math.log2(total);
// }

// function overlaps(a, b) {
//   const aStart = ipToInt(a.base);
//   const aEnd = ipToInt(a.broadcast);
//   const bStart = ipToInt(b.base);
//   const bEnd = ipToInt(b.broadcast);
//   return !(bEnd < aStart || bStart > aEnd);
// }

// function generateSubnets(baseCidr, newPrefix) {
//   const base = new Netmask(baseCidr);
//   const baseStart = ipToInt(base.base);
//   const baseEnd = ipToInt(base.broadcast);
//   const basePrefix = base.bitmask;
// console.log("newPrefix",newPrefix)
//   if (newPrefix < basePrefix) {
//     throw new Error("Not enough space in parent prefix");
//   }

//   const blockSize = 2 ** (32 - newPrefix);
//   const subnets = [];

//   for (let i = baseStart; i + blockSize - 1 <= baseEnd; i += blockSize) {
//     if (i % blockSize === 0) {
//       const cidr = `${intToIp(i)}/${newPrefix}`;
//       subnets.push(new Netmask(cidr));
//     }
//   }

//   return subnets;
// }

// export function calculateSubnets(patientPrefix, requiredIPs) {
//   const requiredPrefix = ipCountToPrefix(requiredIPs);
//   const candidates = generateSubnets(patientPrefix, requiredPrefix);

//   const allocated = []; 

//   for (const candidate of candidates) {
//     let conflict = false;
//     for (const alloc of allocated) {
//       if (overlaps(candidate, alloc)) {
//         conflict = true;
//         break;
//       }
//     }
//     if (!conflict) {
//       return candidate.toString(); 
//     }
//   }

//   return null;
// }
