package api

import (
	"fmt"
	"net"
	"os"

	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
)

func Hello() {
	fmt.Println("hello")

	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})

	var port string
	var ok bool
	port, ok = os.LookupEnv("PORT")

	if ok {
		log.WithField(log.Fields{
			"PORT": port,
		}).Info("PORT env var defined")
	} else {
		port = "9000"
		log.WithField(log.Fields{
			"PORT": port,
		}).Info("PORT env var not defined, going with default")
	}

	l, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.WithFields(log.Fields{
			"Error": err.Error(),
		}).Fatal("Failed to listen")
	}

	grpcServer := grpc.NewServer()

	log.Info("gRPC server started at ", port)
	if err := grpcServer.Serve(l); err != nil {
		log.WithFields(log.Fields{
			"Error": err.Error(),
		}).Fatal("Failed to serve")
	}
}
