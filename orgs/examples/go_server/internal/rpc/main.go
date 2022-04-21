package rpc

import (
	"context"
	"net"

	"github.com/publiclabel/monorepo/libs/go/logger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Start will start the grpc server.
func Start(port string, loglevel string, debug bool, connstring string) {
	// Start Up App Configurations
	logger.Configure(loglevel, "go-server", debug)
	pool := Connect(connstring)
	defer pool.Close()

	err := pool.Ping(context.Background())
	if err != nil {
		logger.Panic(err, "")
	}

	l, err := net.Listen("tcp", ":"+port)
	if err != nil {
		logger.Panic(err, "")
	}

	// GRPC Servers
	grpcServer := grpc.NewServer()
	RegisterPersonsServer(grpcServer, pool)
	reflection.Register(grpcServer)

	logger.Info("gRPC server started at " + port)
	if err := grpcServer.Serve(l); err != nil {
		logger.Error(err, "")
	}
}
