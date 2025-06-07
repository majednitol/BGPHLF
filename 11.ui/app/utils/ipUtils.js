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


export function calculateSubnets(parentPrefix, requiredIPs, alreadyAllocated = []) {
  const requiredPrefix = ipCountToPrefix(requiredIPs);
  const candidates = generateSubnets(parentPrefix, requiredPrefix);

  const allocatedBlocks = alreadyAllocated.map(block => new Netmask(block));

  for (const candidate of candidates) {
    const hasConflict = allocatedBlocks.some(alloc => overlaps(candidate, alloc));
    if (!hasConflict) {
      return candidate.toString();
    }
  }

  return null; // No available subnet found
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
