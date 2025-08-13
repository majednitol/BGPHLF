# First stage: Building srx-crypto-api and gobgpsrx
ARG IMAGE=ubuntu:24.04
FROM $IMAGE AS build

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
    kmod

# Setup build environment
RUN mkdir -p /build/installroot/usr/local/go/bin
WORKDIR "/build/"

# clone and install srx-crypto-api
RUN git clone https://github.com/usnistgov/NIST-BGP-SRx.git && \
    cd NIST-BGP-SRx/srx-crypto-api && \
    ./configure --prefix=/build/installroot/usr/local CFLAGS="-O0 -g" && \
    make -j && \
    make install && \
    make clean

# install go
RUN wget https://go.dev/dl/go1.13.linux-amd64.tar.gz && tar -C /usr/local -xzf go1.13.linux-amd64.tar.gz && rm go1.13.linux-amd64.tar.gz
ENV PATH="$PATH:/usr/local/go/bin:/root/go/bin"
ENV GO111MODULE=on
RUN go get github.com/golang/protobuf/protoc-gen-go@v1.2.0


# install gobgpsrx
ENV CGO_LDFLAGS="-L/build/installroot/usr/local/lib64/srx/ -Wl,-rpath -Wl,/build/installroot/usr/local/lib64/srx/" CGO_CFLAGS="-I/build/installroot/usr/local/include/srx/"
RUN git clone https://github.com/majednitol/gobgpsrx.git && \
    cd gobgpsrx && \
    go build -o /build/installroot/usr/local/go/bin ./...

# prepare for deploy image
RUN cd /build/installroot && tar -cf /build/artifact.tar -C /build/installroot . 


# Second stage: only required binaries, configs and scripts
FROM $IMAGE AS deploy

# Install dependencies
RUN apt-get update && apt-get -y dist-upgrade && \
    apt-get install -y --no-install-recommends libconfig-dev kmod iproute2 && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy over relevant files from build stage, and 'install' them
COPY --from=build /build/artifact.tar /build/
RUN tar -xf /build/artifact.tar -C / && \
    rm -rf /build

ENV PATH="$PATH:/usr/local/go/bin" LD_LIBRARY_PATH="/usr/local/lib64/srx" 

COPY gobgp-router/*.conf /etc/

COPY gobgp-router/run_routers.sh /etc/

COPY gobgp-router/bgpsec-keys /var/lib/bgpsec-keys
COPY gobgp-router/srxcryptoapi.conf /usr/local/etc/srxcryptoapi.conf
RUN sed -i 's/\r$//' /etc/run_routers.sh && chmod +x /etc/run_routers.sh

# Expose gRPC and BGP ports
EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067

# Entry point
CMD ["/bin/bash", "/etc/run_routers.sh"]


# run in docker 
# docker build -t image-name .
# docker run --rm -it --privileged --name router4 image-name












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

