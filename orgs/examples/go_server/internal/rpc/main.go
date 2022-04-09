package rpc

import (
	"context"
	"fmt"
	"net"
	"os"

	pb "github.com/publiclabel/monorepo/orgs/examples/proto"

	log "github.com/sirupsen/logrus"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type server struct {
	pb.UnimplementedPersonsServer
}

func (s *server) GetPersons(ctx context.Context, in *pb.GetPersonsRequest) (*pb.GetPersonsResponse, error) {
	return &pb.GetPersonsResponse{}, nil
}

func Start() {
	fmt.Println("hello")

	log.SetFormatter(&log.TextFormatter{
		FullTimestamp: true,
	})

	var port string
	var ok bool
	port, ok = os.LookupEnv("PORT")

	if ok {
		log.WithFields(log.Fields{
			"PORT": port,
		}).Info("PORT env var defined")
	} else {
		port = "50051"
		log.WithFields(log.Fields{
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

	pb.RegisterPersonsServer(grpcServer, &server{})
	reflection.Register(grpcServer)

	log.Info("gRPC server started at ", port)
	if err := grpcServer.Serve(l); err != nil {
		log.WithFields(log.Fields{
			"Error": err.Error(),
		}).Fatal("Failed to serve")
	}
}
