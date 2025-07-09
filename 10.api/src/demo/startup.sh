#!/bin/bash
set -e

ulimit -n 100000

# Clean up old namespaces
for ns in r1 r2 r3; do
  ip netns del $ns 2>/dev/null || true
done

# Create namespaces
ip netns add r1
ip netns add r2
ip netns add r3

# Create veth pairs
ip link add r1-veth type veth peer name r2-veth
ip link add r2-veth2 type veth peer name r3-veth
ip link add r3-veth2 type veth peer name r1-veth2

# Assign veth ends to namespaces
ip link set r1-veth netns r1
ip link set r1-veth2 netns r1
ip link set r2-veth netns r2
ip link set r2-veth2 netns r2
ip link set r3-veth netns r3
ip link set r3-veth2 netns r3

# Bring up loopback interfaces
for ns in r1 r2 r3; do
  ip netns exec $ns ip link set lo up
done

# Assign IP addresses and bring up interfaces
ip netns exec r1 ip addr add 10.0.12.1/24 dev r1-veth
ip netns exec r1 ip addr add 10.0.31.1/24 dev r1-veth2
ip netns exec r1 ip link set r1-veth up
ip netns exec r1 ip link set r1-veth2 up

ip netns exec r2 ip addr add 10.0.12.2/24 dev r2-veth
ip netns exec r2 ip addr add 10.0.23.1/24 dev r2-veth2
ip netns exec r2 ip link set r2-veth up
ip netns exec r2 ip link set r2-veth2 up

ip netns exec r3 ip addr add 10.0.23.2/24 dev r3-veth
ip netns exec r3 ip addr add 10.0.31.2/24 dev r3-veth2
ip netns exec r3 ip link set r3-veth up
ip netns exec r3 ip link set r3-veth2 up

# Setup FRR runtime directories and fix permissions
for ns in r1 r2 r3; do
  ip netns exec $ns mkdir -p /var/run/frr /var/log/frr
  ip netns exec $ns chown -R frr:frrvty /etc/frr /var/run/frr /var/log/frr
  ip netns exec $ns chmod 755 /var/run/frr
  ip netns exec $ns rm -f /var/run/frr/*.pid
done

# Start FRR daemons (zebra + bgpd) as correct user/group
for ns in r1 r2 r3; do
  ip netns exec $ns /usr/libexec/frr/zebra -d -u frr -g frrvty -i /var/run/frr/zebra-${ns}.pid
  ip netns exec $ns /usr/libexec/frr/bgpd  -d -u frr -g frrvty -i /var/run/frr/bgpd-${ns}.pid
done

# Wait for daemons to initialize sockets
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