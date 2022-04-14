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

type personServer struct {
	pb.UnimplementedPersonsServer
}

func (s *personServer) GetPersons(ctx context.Context, in *pb.GetPersonsRequest) (*pb.GetPersonsResponse, error) {
	persons := []*pb.Person{
		{Name: "Sam"},
	}
	return &pb.GetPersonsResponse{
		Persons: persons,
	}, nil
}

func (s *personServer) CreatePerson(ctx context.Context, in *pb.CreatePersonRequest) (*pb.Person, error) {
	person := pb.Person{
		Name: in.Name,
	}
	return person
}

func RegisterPersonsServer(grpcServer *grpc.Server, _conn *pgx.Conn) {
	conn = _conn
	pb.RegisterPersonsServer(grpcServer, &personServer{})
}
