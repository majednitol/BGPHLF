# -------- STAGE 1: Builder --------
FROM golang:1.23-alpine AS builder

# Install build tools
RUN apk add --no-cache git build-base

# Clone and build GoBGP
WORKDIR /go/src/github.com/osrg/gobgp
RUN git clone https://github.com/osrg/gobgp . && \
    go install ./cmd/gobgpd && \
    go install ./cmd/gobgp

# -------- STAGE 2: Runtime --------
FROM alpine:3.20

# Install bash
RUN apk add --no-cache bash

# Copy GoBGP binaries from builder
COPY --from=builder /go/bin/gobgpd /usr/local/bin/
COPY --from=builder /go/bin/gobgp /usr/local/bin/

# Set workdir and copy config and script
WORKDIR /gobgp
COPY gobgp-router/router1.conf .
COPY gobgp-router/router2.conf .
COPY gobgp-router/run_routers.sh .

# Ensure proper line endings and permissions
RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# Expose BGP API ports
EXPOSE 50051 50052

# Use bash explicitly to avoid exec format issues
CMD ["/bin/bash", "./run_routers.sh"]
