# Use a newer Go version that satisfies the go.mod requirement
FROM golang:1.23-alpine AS build

COPY ./ /go/src/github.com/basic
WORKDIR /go/src/github.com/basic

# Build application
RUN go build -o chaincode -v .

# Production ready image
FROM alpine:3.11 as prod

COPY --from=build /go/src/github.com/basic/chaincode /app/chaincode

USER 1000

WORKDIR /app
CMD ./chaincode
