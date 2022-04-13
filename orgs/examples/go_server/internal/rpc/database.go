package rpc

import (
	"context"
	"os"

	"github.com/jackc/pgx/v4"
	log "github.com/publiclabel/monorepo/libs/go/log"
)

// connStr := "postgres://username:password@localhost:5432/database_name"
func Connect(connStr string) *pgx.Conn {
	conf, err := pgx.ParseConfig(connStr)
	if err != nil {
		log.Error("Unable to parse connStr: " + err.Error())
		os.Exit(1)
	}

	conn, err := pgx.ConnectConfig(context.Background(), conf)
	if err != nil {
		log.Error("Unable to connect to database: " + err.Error())
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	return conn
}
