FROM golang:1 AS builder

WORKDIR /app

COPY ./main.go main.go

RUN CGO_ENABLED=0 go build main.go

# -=== Target Image ===-

FROM gcr.io/distroless/base:debug

COPY --from=builder /app/main /main

CMD ["/main"]
