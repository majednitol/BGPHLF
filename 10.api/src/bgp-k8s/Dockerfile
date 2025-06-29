# -------- STAGE 1: Builder --------
FROM golang:1.23-alpine AS builder

# Install build tools
RUN apk add --no-cache git build-base

# Clone and build GoBGP v3.36.0
WORKDIR /go/src/github.com/osrg/gobgp
RUN git clone https://github.com/osrg/gobgp . && \
    git checkout v3.36.0 && \
    go install ./cmd/gobgpd && \
    go install ./cmd/gobgp

# -------- STAGE 2: Runtime --------
FROM alpine:3.20

# Install bash and IP tools
RUN apk add --no-cache bash iproute2

# Copy GoBGP binaries from builder
COPY --from=builder /go/bin/gobgpd /usr/local/bin/
COPY --from=builder /go/bin/gobgp /usr/local/bin/

# Set workdir and copy config and script files
WORKDIR /gobgp
COPY gobgp-router/router1.conf .
COPY gobgp-router/router2.conf .
COPY gobgp-router/router3.conf .
COPY gobgp-router/router4.conf .
COPY gobgp-router/router5.conf .
COPY gobgp-router/router6.conf .
COPY gobgp-router/router7.conf .
COPY gobgp-router/router8.conf .
COPY gobgp-router/router9.conf .
COPY gobgp-router/router10.conf .
COPY gobgp-router/router11.conf .
COPY gobgp-router/router12.conf .
COPY gobgp-router/router13.conf .
COPY gobgp-router/router14.conf .
COPY gobgp-router/router15.conf .
COPY gobgp-router/router16.conf .
COPY gobgp-router/router17.conf .
COPY gobgp-router/run_routers.sh .

# Ensure script has Unix line endings and is executable
RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# Expose ports for gRPC / GoBGP API
EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 \
       50060 50061 50062 50063 50064 50065 50066 50067

# Start all routers
CMD ["/bin/bash", "./run_routers.sh"]
