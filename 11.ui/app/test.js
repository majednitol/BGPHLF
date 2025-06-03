const CIDR = require('ip-cidr');
const { Address4 } = require('ip-address');

/**
 * Convert integer to dotted IPv4 string.
 */
function intToIPv4(int) {
    return [
        (int >> 24) & 255,
        (int >> 16) & 255,
        (int >> 8) & 255,
        int & 255
    ].join('.');
}

/**
 * Convert IPv4 string to integer.
 */
function ipv4ToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0);
}

/**
 * Calculate smallest subnet blocks to fulfill required IP count.
 * @param {string} parentPrefix e.g. '192.0.2.0/24'
 * @param {number} requiredIPs e.g. 500
 * @returns {string[]} list of allocated sub-prefixes
 */
function calculateSubnets(parentPrefix, requiredIPs) {
    const cidr = new CIDR(parentPrefix);
    if (!cidr.isValid()) throw new Error(`Invalid CIDR: ${parentPrefix}`);

    const baseMask = parseInt(parentPrefix.split('/')[1]);
    const totalIPs = cidr.addressCount;
    if (requiredIPs > totalIPs) {
        throw new Error(`Requested IPs (${requiredIPs}) exceed available in ${parentPrefix} (${totalIPs})`);
    }

    let currentIPInt = ipv4ToInt(cidr.start());
    const endIPInt = ipv4ToInt(cidr.end());
    const subnets = [];

    let remaining = requiredIPs;
    while (remaining > 0 && currentIPInt <= endIPInt) {
        let subnetSize = 32;
        let blockSize = 1;

        // Find largest block size <= remaining and fits within parent range
        while (subnetSize > baseMask) {
            blockSize = Math.pow(2, 32 - subnetSize);
            const blockEnd = currentIPInt + blockSize - 1;
            if (blockSize <= remaining && blockEnd <= endIPInt) {
                break;
            }
            subnetSize--;
        }

        subnets.push(`${intToIPv4(currentIPInt)}/${subnetSize}`);
        currentIPInt += blockSize;
        remaining -= blockSize;
    }

    if (remaining > 0) {
        throw new Error("Unable to allocate enough IPs from parent prefix.");
    }

    return subnets;
}
try {
    const assigned = calculateSubnets('192.0.1.0/24', 500); // Only 256 IPs in /24 → will throw error
    console.log('Subnets assigned:', assigned);
} catch (err) {
    console.error('❌ Error:', err.message);
}

try {
    const assigned = calculateSubnets('192.0.0.0/22', 500); // 1024 IPs available
    console.log('✅ Subnets assigned:', assigned);
} catch (err) {
    console.error('❌ Error:', err.message);
}
