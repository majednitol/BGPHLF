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
# COPY gobgp-router/router1.conf .
# COPY gobgp-router/router2.conf .
# COPY gobgp-router/router3.conf .
# COPY gobgp-router/router4.conf .
# COPY gobgp-router/router5.conf .
# COPY gobgp-router/router6.conf .
# COPY gobgp-router/router7.conf .
# COPY gobgp-router/router8.conf .
# COPY gobgp-router/router9.conf .
# COPY gobgp-router/router10.conf .
# COPY gobgp-router/router11.conf .
# COPY gobgp-router/router12.conf .
# COPY gobgp-router/router13.conf .
# COPY gobgp-router/router14.conf .
# COPY gobgp-router/router15.conf .
# COPY gobgp-router/router16.conf .
# COPY gobgp-router/router17.conf .



# COPY gobgp-router/run_routers.sh .

# # Ensure script has Unix line endings and is executable
# RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# # Expose ports for gRPC / GoBGP API
# EXPOSE 50051 50052 50053 50054 50055 50056 50057 50058 50059 50060 50061 50062 50063 50064 50065 50066 50067

# # Start all routers
# CMD ["/bin/bash", "./run_routers.sh"]




# -------- STAGE 1: Builder for GoBGP --------
FROM golang:1.23-alpine AS builder

RUN apk add --no-cache git build-base

WORKDIR /go/src/github.com/osrg/gobgp
RUN git clone https://github.com/osrg/gobgp . && \
    git checkout v3.36.0 && \
    go install ./cmd/gobgpd && \
    go install ./cmd/gobgp

# -------- STAGE 2: Runtime --------
FROM alpine:3.20

# Install required tools
RUN apk add --no-cache bash iproute2 curl libgcc libstdc++ tzdata

# Set Routinator version
ENV ROUTINATOR_VERSION=0.13.1

# Download and extract Routinator binary
RUN curl -L https://github.com/NLnetLabs/routinator/releases/download/v${ROUTINATOR_VERSION}/routinator-${ROUTINATOR_VERSION}-x86_64-unknown-linux-musl.tar.gz \
    | tar -xz -C /usr/local/bin --strip-components=1 --wildcards '*/routinator'

# Copy GoBGP from builder
COPY --from=builder /go/bin/gobgpd /usr/local/bin/
COPY --from=builder /go/bin/gobgp /usr/local/bin/

# Set working directory
WORKDIR /gobgp
COPY gobgp-router/*.conf ./
COPY gobgp-router/run_routers.sh ./

# Make script executable
RUN sed -i 's/\r$//' run_routers.sh && chmod +x run_routers.sh

# Expose BGP and Routinator ports
EXPOSE 179 50051-50067 3323 8282

# Start routers (you can add Routinator to the script or supervise it)
CMD ["/bin/bash", "./run_routers.sh"]
