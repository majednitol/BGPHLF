#!/bin/bash
set -e

ulimit -n 100000

echo "[INFO] Cleaning up old namespaces..."
for ns in r1 r2 r3; do
  ip netns del $ns 2>/dev/null || true
done

echo "[INFO] Creating namespaces..."
ip netns add r1
ip netns add r2
ip netns add r3

echo "[INFO] Creating and linking veth interfaces..."
ip link add r1-veth type veth peer name r2-veth
ip link add r2-veth2 type veth peer name r3-veth
ip link add r3-veth2 type veth peer name r1-veth2

ip link set r1-veth netns r1
ip link set r1-veth2 netns r1
ip link set r2-veth netns r2
ip link set r2-veth2 netns r2
ip link set r3-veth netns r3
ip link set r3-veth2 netns r3

echo "[INFO] Bringing up loopback and interfaces..."
for ns in r1 r2 r3; do
  ip netns exec $ns ip link set lo up
done

ip netns exec r1 ip link set r1-veth up
ip netns exec r1 ip link set r1-veth2 up
ip netns exec r2 ip link set r2-veth up
ip netns exec r2 ip link set r2-veth2 up
ip netns exec r3 ip link set r3-veth up
ip netns exec r3 ip link set r3-veth2 up

echo "[INFO] Assigning IP addresses..."
# r1
ip netns exec r1 ip addr add 192.0.2.1/30 dev r1-veth
ip netns exec r1 ip addr add 192.0.2.5/30 dev r1-veth2
ip netns exec r1 ip addr add 1.1.1.1/32 dev lo

# r2
ip netns exec r2 ip addr add 192.0.2.2/30 dev r2-veth
ip netns exec r2 ip addr add 192.0.2.9/30 dev r2-veth2
ip netns exec r2 ip addr add 2.2.2.2/32 dev lo

# r3
ip netns exec r3 ip addr add 192.0.2.10/30 dev r3-veth
ip netns exec r3 ip addr add 192.0.2.6/30 dev r3-veth2
ip netns exec r3 ip addr add 3.3.3.3/32 dev lo

echo "[INFO] Adding static routes..."
ip netns exec r1 ip route add 2.2.2.2/32 via 192.0.2.2 dev r1-veth
ip netns exec r1 ip route add 3.3.3.3/32 via 192.0.2.6 dev r1-veth2

ip netns exec r2 ip route add 1.1.1.1/32 via 192.0.2.1 dev r2-veth
ip netns exec r2 ip route add 3.3.3.3/32 via 192.0.2.10 dev r2-veth2

ip netns exec r3 ip route add 1.1.1.1/32 via 192.0.2.5 dev r3-veth2
ip netns exec r3 ip route add 2.2.2.2/32 via 192.0.2.9 dev r3-veth


echo "[INFO] Preparing FRR runtime directories and applying configs..."

for ns in r1 r2 r3; do
  if [ ! -f /configs/${ns}.conf ]; then
    echo "[ERROR] Config file /configs/${ns}.conf not found!"
    exit 1
  fi

  mkdir -p /etc/frr/$ns /var/run/frr/$ns /var/log/frr/$ns
  chown -R frr:frrvty /etc/frr/$ns /var/run/frr/$ns /var/log/frr/$ns

  cp /configs/${ns}.conf /etc/frr/$ns/frr.conf
  chown frr:frr /etc/frr/$ns/frr.conf

  echo "[INFO] Contents of /etc/frr/$ns/frr.conf:"
  cat /etc/frr/$ns/frr.conf
done


echo "[INFO] Starting FRR daemons..."
for ns in r1 r2 r3; do
  echo "  - Starting zebra and bgpd in $ns"
  ip netns exec $ns /usr/libexec/frr/zebra \
    -d -u frr -g frrvty -i /var/run/frr/$ns/zebra.pid \
    -f /etc/frr/$ns/frr.conf || echo "[ERROR] zebra failed in $ns"

  ip netns exec $ns /usr/libexec/frr/bgpd \
    -d -u frr -g frrvty -i /var/run/frr/$ns/bgpd.pid \
    -f /etc/frr/$ns/frr.conf || echo "[ERROR] bgpd failed in $ns"
done

echo "[INFO] Waiting for daemons to start..."
sleep 5

# Apply configuration using vtysh (after daemons are ready)
ip netns exec r1 vtysh -f /configs/r1.conf
ip netns exec r2 vtysh -f /configs/r2.conf
ip netns exec r3 vtysh -f /configs/r3.conf

echo "[INFO] All BGP routers are configured and running."
echo "[INFO] You can inspect them using: ip netns exec r1 vtysh -c 'show ip bgp summary'"

# Keep container running
tail -f /dev/null



# docker run --rm -it --privileged frr-allinone21
# 2025/07/09 05:58:18 ZEBRA: [NNACN-54BDA][EC 4043309110] Disabling MPLS support (no kernel support)
# 2025/07/09 05:58:19 ZEBRA: [NNACN-54BDA][EC 4043309110] Disabling MPLS support (no kernel support)
# 2025/07/09 05:58:19 ZEBRA: [NNACN-54BDA][EC 4043309110] Disabling MPLS support (no kernel support)
# [91|zebra] sending configuration
# [97|bgpd] sending configuration
# [91|zebra] done
# % Can not configure the local system as neighbor
# line 16: Failure to communicate[13] to bgpd, line:  neighbor 10.0.31.2 remote-as 65003

# % Specify remote-as or peer-group commands first
# line 17: Failure to communicate[13] to bgpd, line:  neighbor 10.0.31.2 update-source 10.0.31.1

# [97|bgpd] Configuration file[/etc/frr/frr.conf] processing failure: 13
# Waiting for children to finish applying config...
# majed@DESKTOP-161F6TB:/BGPHLF/10.api/src/demo$ 