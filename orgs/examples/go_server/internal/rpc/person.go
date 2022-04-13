package rpc

import (
	"context"

	"github.com/jackc/pgx/v4"
	pb "github.com/publiclabel/monorepo/orgs/examples/proto"
	"google.golang.org/grpc"
)

var (
	conn *pgx.Conn
)

type server struct {
	pb.UnimplementedPersonsServer
}

func (s *server) GetPersons(ctx context.Context, in *pb.GetPersonsRequest) (*pb.GetPersonsResponse, error) {
	persons := []*pb.Person{
		{Name: "Sam"},
	}
	return &pb.GetPersonsResponse{
		Persons: persons,
	}, nil
}

func RegisterPersonsServer(grpcServer *grpc.Server, _conn *pgx.Conn) {
	conn = _conn
	pb.RegisterPersonsServer(grpcServer, &server{})
}
