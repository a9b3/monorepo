package rpc

import (
	"context"
	"net"

	pb "github.com/publiclabel/monorepo/orgs/examples/proto"

	log "github.com/publiclabel/monorepo/libs/go/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type server struct {
	pb.UnimplementedPersonsServer
}

func (s *server) GetPersons(ctx context.Context, in *pb.GetPersonsRequest) (*pb.GetPersonsResponse, error) {
	return &pb.GetPersonsResponse{}, nil
}

// Start will start the grpc server.
func Start(port string, loglevel string, debug bool) {
	log.SetGlobalLevel(loglevel)
	if debug {
		log.EnablePrettyLogging()
	}

	l, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatal(err.Error())
	}

	grpcServer := grpc.NewServer()

	pb.RegisterPersonsServer(grpcServer, &server{})
	reflection.Register(grpcServer)

	log.Info("gRPC server started at " + port)
	if err := grpcServer.Serve(l); err != nil {
		log.Error(err.Error())
	}
}
