FROM hyperledger/caliper:0.6.0

USER root
RUN chown -R node:node /hyperledger/caliper/workspace
USER node

# Install axios as user node
RUN npm install axios

COPY benchmarks ./benchmarks

# Bind Caliper to fabric 2.4 SDK
RUN npx caliper bind --caliper-bind-sut fabric:2.4

