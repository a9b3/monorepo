package rpc

import (
	"context"
	"os"

	"github.com/jackc/pgx/v4"
	"github.com/publiclabel/monorepo/libs/go/logger"
)

// connStr := "postgres://username:password@localhost:5432/database_name"
func Connect(connStr string) *pgx.Conn {
	conf, err := pgx.ParseConfig(connStr)
	if err != nil {
		logger.Error("Unable to parse connStr: " + err.Error())
		os.Exit(1)
	}

	conn, err := pgx.ConnectConfig(context.Background(), conf)
	if err != nil {
		logger.Error("Unable to connect to database: " + err.Error())
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	return conn
}
