package rpc

import (
	"context"
	"log"

	"github.com/publiclabel/monorepo/orgs/examples/go_server/internal/sqlc/person"

	"github.com/google/uuid"
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
	queries := person.New(conn)

	persons, err := queries.GetPersons(ctx)
	if err != nil {
		log.Panic(err)
	}

	var retPersons []*pb.Person
	for i := 0; i < len(persons); i++ {
		protoPerson := persons[i].ToProto()
		retPersons = append(
			retPersons,
			&protoPerson,
		)
	}

	return &pb.GetPersonsResponse{
		Persons: retPersons,
	}, nil
}

func (s *personServer) CreatePerson(ctx context.Context, in *pb.CreatePersonRequest) (*pb.Person, error) {
	queries := person.New(conn)

	createdPerson, err := queries.CreatePerson(ctx, person.CreatePersonParams{
		ID:       uuid.New(),
		Username: in.Username,
	})
	if err != nil {
		log.Panic(err)
	}

	person := pb.Person{
		Id:       createdPerson.ID.String(),
		Username: createdPerson.Username,
	}

	return &person, nil
}

func RegisterPersonsServer(grpcServer *grpc.Server, _conn *pgx.Conn) {
	conn = _conn
	pb.RegisterPersonsServer(grpcServer, &personServer{})
}
