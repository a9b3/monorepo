package rpc

import (
	"net"

	"github.com/publiclabel/monorepo/libs/go/logger"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Start will start the grpc server.
func Start(port string, loglevel string, debug bool, connstring string) {
	// Start Up App Configurations
	logger.Configure(loglevel, "go-server", debug)
	conn := Connect(connstring)

	l, err := net.Listen("tcp", ":"+port)
	if err != nil {
		logger.Fatal(err.Error())
	}

	// GRPC Servers
	grpcServer := grpc.NewServer()
	RegisterPersonsServer(grpcServer, conn)
	reflection.Register(grpcServer)

	logger.Info("gRPC server started at " + port)
	if err := grpcServer.Serve(l); err != nil {
		logger.Error(err.Error())
	}
}
