# -------- STAGE 1: Builder --------
FROM golang:1.23-alpine AS builder

# Install build tools
RUN apk add --no-cache git build-base

# Clone and build GoBGP
WORKDIR /go/src/github.com/osrg/gobgp
RUN git clone --depth=1 https://github.com/osrg/gobgp.git . && \
    go install ./cmd/gobgpd && \
    go install ./cmd/gobgp

# -------- STAGE 2: Runtime --------
FROM alpine:3.20

# Install bash, iproute2, git, curl, unzip (needed for grpcurl and git clone)
RUN apk add --no-cache bash iproute2 git curl unzip

# Clone GoBGP source for proto files
RUN git clone --depth=1 https://github.com/osrg/gobgp.git /gobgp-src

# Copy raw .proto files from api/proto into /gobgp-proto
RUN mkdir -p /gobgp-proto && \
    cp /gobgp-src/api/proto/*.proto /gobgp-proto/

# Download and install grpcurl
RUN curl -L https://github.com/fullstorydev/grpcurl/releases/download/v1.8.9/grpcurl_1.8.9_linux_x86_64.tar.gz -o /tmp/grpcurl.tar.gz && \
    tar -xzf /tmp/grpcurl.tar.gz -C /usr/local/bin grpcurl && \
    chmod +x /usr/local/bin/grpcurl && \
    rm /tmp/grpcurl.tar.gz

# Copy GoBGP binaries from builder
COPY --from=builder /go/bin/gobgpd /usr/local/bin/
COPY --from=builder /go/bin/gobgp /usr/local/bin/

WORKDIR /gobgp

# Copy router config files and run script
COPY gobgp-router/router*.conf /gobgp/
COPY gobgp-router/run_routers.sh /gobgp/

# Fix line endings and permissions for the run script
RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# Expose BGP API ports for all routers
EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067

CMD ["/bin/bash", "./run_routers.sh"]
