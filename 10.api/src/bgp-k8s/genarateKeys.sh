#!/bin/bash
set -e

# Parameters or env vars
ASN=65002
BGPID=10.0.0.2
KEY_DIR="$PWD/gobgp-router/r1-keys"    # Matching your key-path in config
VALIDITY_DAYS=365

# Create key base directory if not exist
mkdir -p "$KEY_DIR"
cd "$KEY_DIR"

# Normalize ASN and generate ASN_HEX
ASN_HEX=$(printf %08X $ASN)

# Generate EC private key PEM
openssl ecparam -name prime256v1 -genkey -noout -out "$ASN.pem"

# Create OpenSSL config file from heredoc
cat > bgpsec-openssl.conf <<EOF
[ req ]
distinguished_name = req_distinguished_name
x509_extensions = bgpsec_router_ext
prompt = no

[ req_distinguished_name ]
CN = ROUTER-${ASN_HEX}

[ bgpsec_router_ext ]
keyUsage = digitalSignature
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid,issuer
extendedKeyUsage = 1.3.6.1.5.5.7.3.30
sbgp-autonomousSysNum = critical, AS:${ASN}, RDI:inherit
EOF

# Generate CSR
openssl req -new -key "$ASN.pem" -out "$ASN.csr" -config bgpsec-openssl.conf

# Create self-signed certificate (PEM format)
openssl req -x509 -days $VALIDITY_DAYS -key "$ASN.pem" -in "$ASN.csr" -out "$ASN.pem.cert.pem" -extensions bgpsec_router_ext -config bgpsec-openssl.conf

# Convert PEM cert to DER format
openssl x509 -in "$ASN.pem.cert.pem" -outform DER -out "$ASN.cert"
cp "$ASN.cert" "$ASN.der"

# Extract SKI in uppercase hex (macOS-compatible)
SKI=$(openssl x509 -in "$ASN.pem.cert.pem" -noout -text | awk '/Subject Key Identifier:/ {getline; print}' | tr -d ' \n:' | tr 'a-f' 'A-F')

if [[ ${#SKI} -ne 40 ]]; then
  echo "❌ Error: Could not extract valid SKI"
  exit 1
fi

# Create two-level directory under key-path based on first 4 hex chars of SKI
DIR1=${SKI:0:2}
DIR2=${SKI:2:2}
FINAL_DIR="${KEY_DIR}/${DIR1}/${DIR2}"
mkdir -p "$FINAL_DIR"

# Copy cert and key files to this directory, named by SKI
cp "$ASN.cert" "$FINAL_DIR/${SKI}.cert"
cp "$ASN.der" "$FINAL_DIR/${SKI}.der"
cp "$ASN.pem.cert.pem" "$FINAL_DIR/${SKI}.pem"

# Create ski-list.txt mapping AS to SKI
cat > "${KEY_DIR}/ski-list.txt" <<EOF
# This file contains SKI's to Demo keys generated
# for demonstration and testing purposes.
# AS number to SKI certificate mapping:


${ASN}-SKI: ${SKI}
EOF

# Create priv-ski-list.txt mapping AS to SKI
cat > "${KEY_DIR}/priv-ski-list.txt" <<EOF
# This file contains SKI's to Demo private keys generated
# for demonstration and testing purposes.
# AS number to SKI private key mapping:


${ASN}-SKI: ${SKI}
EOF

echo "✅ Key and certificate generation complete."
echo "📁 Files stored under: $FINAL_DIR"

# Cleanup temporary files
rm -f "$ASN.pem.cert.pem" "$ASN.csr" bgpsec-openssl.conf
