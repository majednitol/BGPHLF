

FROM ubuntu:24.04

# Install build and runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libconfig-dev \
    uthash-dev \
    build-essential \
    wget \
    libssl-dev \
    automake \
    autoconf \
    pkg-config \
    iproute2 \
    iputils-ping \
    curl \
    ca-certificates \
    bash \
    coreutils \
    busybox \
    kmod \
    && rm -rf /var/lib/apt/lists/*

# Install Go
RUN mkdir -p /usr/local/go/bin
WORKDIR /root

# clone and install srx-crypto-api
RUN git clone https://github.com/usnistgov/NIST-BGP-SRx.git && \
    cd NIST-BGP-SRx/srx-crypto-api && \
    ./configure --prefix=/usr/local CFLAGS="-O0 -g" && \
    make -j && \
    make all install && \
    make clean

# install go
RUN wget https://go.dev/dl/go1.23.5.linux-amd64.tar.gz && tar -C /usr/local -xzf go1.23.5.linux-amd64.tar.gz && rm go1.23.5.linux-amd64.tar.gz
ENV PATH="$PATH:/usr/local/go/bin:/root/go/bin"
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@latest && go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# install gobgpsrx
ENV CGO_LDFLAGS="-L/usr/local/lib64/srx/ -Wl,-rpath -Wl,/usr/local/lib64/srx/" CGO_CFLAGS="-I/usr/local/include/srx/"
RUN git clone https://github.com/usnistgov/gobgpsrx.git && \
    cd gobgpsrx && \
    go build -o /usr/local/go/bin ./...


ENV PATH="$PATH:/usr/local/go/bin" LD_LIBRARY_PATH="/usr/local/lib64/srx"

COPY gobgp-router/*.conf /etc/
COPY gobgp-router/run_routers.sh /etc/
RUN sed -i 's/\r$//' /etc/run_routers.sh && chmod +x /etc/run_routers.sh

# Expose gRPC and BGP ports
EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067

# Entry point
CMD ["/bin/bash", "/etc/run_routers.sh"]







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


##############################################################
# Dockerfile to build GoBGPSec container images
# Based on ubuntu 24.04
##############################################################

