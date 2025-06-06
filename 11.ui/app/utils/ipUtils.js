

import { Netmask } from 'netmask';

function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

function intToIp(int) {
  return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
}

function ipCountToPrefix(requiredIPs) {
  if (requiredIPs <= 0) throw new Error('Required IPs must be greater than zero');
  let total = 1;
  while (total < requiredIPs + 2) total *= 2;
  return 32 - Math.log2(total);
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
  const blockSize = 2 ** (32 - newPrefix);
  const subnets = [];

  for (let i = baseStart; i <= baseEnd; i += blockSize) {
    if (i + blockSize - 1 <= baseEnd) {
      subnets.push(new Netmask(`${intToIp(i)}/${newPrefix}`));
    }
  }
  return subnets;
}

function calculateAvailablePrefixBlock(parentBlock, allocated) {
  const parent = new Netmask(parentBlock);
  const start = ipToInt(parent.base);
  const end = ipToInt(parent.broadcast);

  const sorted = allocated.map(b => new Netmask(b))
    .sort((a, b) => ipToInt(a.base) - ipToInt(b.base));

  let maxGap = 0;
  let maxGapStart = start;
  let current = start;

  for (const block of sorted) {
    const blockStart = ipToInt(block.base);
    if (blockStart > current) {
      const gapSize = blockStart - current;
      if (gapSize > maxGap) {
        maxGap = gapSize;
        maxGapStart = current;
      }
    }
    current = Math.max(current, ipToInt(block.broadcast) + 1);
  }

  if (current <= end) {
    const gapSize = end - current + 1;
    if (gapSize > maxGap) {
      maxGap = gapSize;
      maxGapStart = current;
    }
  }

  if (maxGap === 0) return null;

 const candidatePrefix = 32 - Math.floor(Math.log2(maxGap));
const candidateSubnets = generateSubnets(`${intToIp(maxGapStart)}/${candidatePrefix}`, candidatePrefix);
const valid = candidateSubnets.find(subnet =>
  !sorted.some(alloc => overlaps(subnet, alloc))
);
return valid ? valid.toString() : null;

}

export function calculateSubnets(parentPrefix, requiredIPs, alreadyAllocated = []) {
  const requiredPrefix = ipCountToPrefix(requiredIPs);
  const candidates = generateSubnets(parentPrefix, requiredPrefix);
  const allocatedBlocks = alreadyAllocated.map(b => new Netmask(b));

  const availableSubnets = candidates.filter(candidate =>
    !allocatedBlocks.some(alloc => overlaps(candidate, alloc))
  );

  const availableBlock = calculateAvailablePrefixBlock(parentPrefix, alreadyAllocated);

  return {
    subnets: availableSubnets.map(s => s.toString()),
    availableBlock
  };
}

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
