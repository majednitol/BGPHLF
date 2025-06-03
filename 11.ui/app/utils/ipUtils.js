import { Netmask } from 'netmask';

function ipToInt(ip) {
  return ip.split('.').reduce((acc, octet) => acc * 256 + Number(octet), 0);
}

function intToIp(int) {
  return [24, 16, 8, 0].map(shift => (int >> shift) & 255).join('.');
}

export function calculateSubnets(parentPrefix, requiredIPs) {
  const parent = new Netmask(parentPrefix);
  const parentStart = ipToInt(parent.base);
  const parentEnd = ipToInt(parent.broadcast);

  let remaining = requiredIPs;
  let currentIP = parentStart;
  const subnets = [];

  while (remaining > 0 && currentIP <= parentEnd) {
    for (let cidr = 30; cidr <= 32; cidr++) {
      const total = 2 ** (32 - cidr);
      const usable = cidr >= 31 ? (cidr === 31 ? 2 : 1) : total - 2;

      if (usable >= remaining && currentIP + total - 1 <= parentEnd) {
        subnets.push(`${intToIp(currentIP)}/${cidr}`);
        remaining -= usable;
        currentIP += total;
        break;
      }
    }
  }

  if (remaining > 0) {
    throw new Error('Not enough space in parent prefix');
  }

  return subnets;
}
