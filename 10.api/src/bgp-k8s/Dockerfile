# -------- STAGE 1: Builder --------
FROM golang:1.23-alpine AS builder

# Install build tools and dependencies
RUN apk add --no-cache git build-base libconfig-dev uthash-dev openssl-dev automake curl ca-certificates wget openssl-dev

# Clone and build GoBGP v3.36.0
WORKDIR /go/src/github.com/osrg/gobgp
RUN git clone https://github.com/osrg/gobgp . && \
    git checkout v3.36.0 && \
    go install ./cmd/gobgpd && \
    go install ./cmd/gobgp

# Clone and build NIST-SRx Crypto API
WORKDIR /root
RUN git clone https://github.com/usnistgov/NIST-BGP-SRx.git /go/src/github.com/usnistgov/NIST-BGP-SRx && \
    cd /go/src/github.com/usnistgov/NIST-BGP-SRx/srx-crypto-api && \
    ./configure --prefix=/usr/local CFLAGS="-O0 -g -I/usr/include" LDFLAGS="-L/usr/lib" && \
    make -j && \
    make all install && \
    make clean

# Build gobgpsrx (GoBGPsec fork using NIST BGPSRx CryptoAPI)

RUN git clone https://github.com/usnistgov/gobgpsrx.git /go/src/github.com/usnistgov/gobgpsrx && \
    cd /go/src/github.com/usnistgov/gobgpsrx && \
    export CGO_LDFLAGS="-L/usr/local/lib64/srx/ -Wl,-rpath -Wl,/usr/local/lib64/srx/" && \
    export CGO_CFLAGS="-I/usr/local/include/srx/" && \
    go build -o /go/bin/gobgpsrx ./...

# -------- STAGE 2: Runtime --------
FROM alpine:3.20

# Install bash and IP tools
RUN apk add --no-cache \
    bash \
    iproute2 \
    iputils \
    openssl \
    libstdc++ \
    ca-certificates \
    curl \
    libconfig \
    coreutils \
    busybox-extras

# Copy GoBGP binaries from builder
COPY --from=builder /go/bin/gobgpd /usr/local/bin/
COPY --from=builder /go/bin/gobgp /usr/local/bin/
COPY --from=builder /go/bin/gobgpsrx /usr/local/bin/

# Copy NIST-SRx CryptoAPI libs
COPY --from=builder /usr/local/lib64/srx/ /usr/local/lib64/srx/
COPY --from=builder /usr/local/lib/libsrx* /usr/local/lib/
COPY --from=builder /usr/local/lib64/libsrx* /usr/local/lib64/
COPY --from=builder /usr/local/include/srx /usr/local/include/srx

# Set library path for runtime
ENV LD_LIBRARY_PATH=/usr/local/lib64/srx:/usr/local/lib:$LD_LIBRARY_PATH

# Set workdir and copy config and script files (adjust as needed)
WORKDIR /gobgp
COPY gobgp-router/*.conf ./
COPY gobgp-router/run_routers.sh ./

# Ensure script has Unix line endings and executable permissions
RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# Expose default GoBGP API ports (adjust as needed)
EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067
 
# Entrypoint command to start routers
CMD ["/bin/bash", "./run_routers.sh"]





# # -------- STAGE 1: Builder --------
# FROM golang:1.23-alpine AS builder

# # Install build tools
# RUN apk add --no-cache git build-base

# # Clone and build GoBGP v3.36.0
# WORKDIR /go/src/github.com/osrg/gobgp
# RUN git clone https://github.com/osrg/gobgp . && \
#     git checkout v3.36.0 && \
#     go install ./cmd/gobgpd && \
#     go install ./cmd/gobgp

# # -------- STAGE 2: Runtime --------
# FROM alpine:3.20

# # Install bash and IP tools
# RUN apk add --no-cache bash iproute2

# # Copy GoBGP binaries from builder
# COPY --from=builder /go/bin/gobgpd /usr/local/bin/
# COPY --from=builder /go/bin/gobgp /usr/local/bin/

# # Set workdir and copy config and script files
# WORKDIR /gobgp
# COPY gobgp-router/*.conf ./
# COPY gobgp-router/run_routers.sh ./

# # Ensure script has Unix line endings and is executable
# RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# # Expose ports for gRPC / GoBGP API
# EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067

# # Start all routers
# CMD ["/bin/bash", "./run_routers.sh"]


