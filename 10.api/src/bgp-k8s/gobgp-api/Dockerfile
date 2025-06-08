FROM golang:1.24-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server -v .

FROM alpine:3.18 AS prod
RUN adduser -D -u 1000 appuser

WORKDIR /app
COPY --from=build /app/server .


USER 1000
EXPOSE 2000
CMD ["./server"]
