# -------- Stage 1: Builder --------
FROM alpine:3.19 AS builder

# Install build dependencies
RUN apk add --no-cache \
    git build-base autoconf automake libtool pkgconfig \
    cmake doxygen readline-dev json-c-dev c-ares-dev \
    elfutils-dev net-snmp-dev libyang-dev iproute2 \
    python3 py3-pip python3-dev py3-setuptools py3-wheel \
    protobuf-c protobuf-c-dev \
    flex bison libcap-dev bash

# Set working directory
WORKDIR /frr

# Clone and build FRR
RUN git clone --branch frr-10.3.1 https://github.com/FRRouting/frr.git . && \
    ./bootstrap.sh && \
    ./configure \
        --prefix=/usr \
        --sbindir=/usr/lib/frr \
        --sysconfdir=/etc/frr \
        --localstatedir=/var/run/frr \
        --libexecdir=/usr/libexec/frr \
        --enable-exampledir=/usr/share/doc/frr/examples/ \
        --enable-vty-group=frrvty \
        --enable-user=frr \
        --enable-systemd=no \
        --enable-snmp=agentx && \
    make -j$(nproc) && \
    make install && \
    mkdir -p /etc/frr && \
    cp tools/frr-reload.py /usr/bin/ && \
    cp -r tools/etc/frr/* /etc/frr/

# -------- Stage 2: Runtime --------
FROM alpine:3.19

# Install runtime dependencies
RUN apk add --no-cache \
    bash iproute2 iputils json-c c-ares libyang net-snmp \
    libcap protobuf-c python3

# Create frr and frrvty users/groups and necessary directories
RUN addgroup -S frr && \
    addgroup -S frrvty && \
    adduser -S frr -G frr && \
    adduser frr frrvty && \
    mkdir -p /var/run/frr /var/log/frr /etc/frr /usr/libexec/frr && \
    chown -R frr:frrvty /var/run/frr /var/log/frr /etc/frr /usr/libexec/frr

# Copy built binaries and configs from builder
COPY --from=builder /usr/lib /usr/lib
COPY --from=builder /usr/lib/frr /usr/libexec/frr
COPY --from=builder /usr/bin /usr/bin
COPY --from=builder /etc/frr /etc/frr

# Copy startup script and configuration files
COPY startup.sh /startup.sh
COPY configs/ /configs/

# Make the startup script executable
RUN chmod +x /startup.sh

# Entrypoint
CMD ["/startup.sh"]
