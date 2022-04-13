package rpc

import (
	"net"

	log "github.com/publiclabel/monorepo/libs/go/log"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

// Start will start the grpc server.
func Start(port string, loglevel string, debug bool, connstring string) {
	// Start Up App Configurations
	log.Configure(loglevel, "go-server", debug)
	conn := Connect(connstring)

	l, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatal(err.Error())
	}

	// GRPC Servers
	grpcServer := grpc.NewServer()
	RegisterPersonsServer(grpcServer, conn)
	reflection.Register(grpcServer)

	log.Info("gRPC server started at " + port)
	if err := grpcServer.Serve(l); err != nil {
		log.Error(err.Error())
	}
}
