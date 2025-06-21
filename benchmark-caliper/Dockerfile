FROM hyperledger/caliper:0.6.0

WORKDIR /hyperledger/caliper/workspace

RUN npm install axios


COPY benchmarks ./benchmarks
RUN npx caliper bind --caliper-bind-sut fabric:2.2



