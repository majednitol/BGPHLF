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

// ------------------ Test Cases ------------------

function runTests() {
  try {
    console.log('Test Case 1:');
    const result1 = calculateSubnets('192.168.0.0/24', 5);
    console.log('Expected ~1 subnet (e.g. /29):', result1);

    console.log('\nTest Case 2:');
    const result2 = calculateSubnets('192.168.1.0/28', 10);
    console.log('Expected ~error or multiple subnets:', result2);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runTests();
