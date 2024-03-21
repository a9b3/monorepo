package rpc

import (
	"context"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/publiclabel/monorepo/repos/libs/go/logger"
)

// connStr := "postgres://username:password@localhost:5432/database_name"
func Connect(connStr string) *pgxpool.Pool {
	conf, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		logger.Error(err, "")
		os.Exit(1)
	}

	dbPool, err := pgxpool.ConnectConfig(context.Background(), conf)
	if err != nil {
		logger.Error(err, "")
		os.Exit(1)
	}

	err = dbPool.Ping(context.Background())
	if err != nil {
		logger.Panic(err, "")
	}

	return dbPool
}
