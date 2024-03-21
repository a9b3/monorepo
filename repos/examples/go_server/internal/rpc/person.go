package rpc

import (
	"context"

	"github.com/publiclabel/monorepo/repos/examples/go_server/internal/sqlc/models"
	"github.com/publiclabel/monorepo/repos/libs/go/logger"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	pb "github.com/publiclabel/monorepo/repos/examples/proto"
	"google.golang.org/grpc"
)

var (
	pool *pgxpool.Pool
)

type personServer struct {
	pb.UnimplementedPersonsServer
}

func (s *personServer) GetPersons(ctx context.Context, in *pb.GetPersonsRequest) (*pb.GetPersonsResponse, error) {
	err := pool.Ping(ctx)
	if err != nil {
		logger.Panic(err, "")
	}

	queries := models.New(pool)

	persons, err := queries.GetPersons(ctx)
	if err != nil {
		logger.Panic(err, "")
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
	queries := models.New(pool)

	createdPerson, err := queries.CreatePerson(ctx, models.CreatePersonParams{
		ID:       uuid.New(),
		Username: in.Username,
	})
	if err != nil {
		logger.Panic(err, "")
	}

	person := pb.Person{
		Id:       createdPerson.ID.String(),
		Username: createdPerson.Username,
	}

	return &person, nil
}

func RegisterPersonsServer(grpcServer *grpc.Server, _pool *pgxpool.Pool) {
	pool = _pool
	pb.RegisterPersonsServer(grpcServer, &personServer{})
}
