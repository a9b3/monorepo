package cmd

import (
	"log"

	migrate "github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/pgx"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/spf13/cobra"
)

var migrateCmd = &cobra.Command{
	Use:   "migrate",
	Short: "Migrate the database",
	Long:  "Migrate the database",
	Run: func(cmd *cobra.Command, args []string) {
		connString, _ := cmd.Flags().GetString("connstring")
		migrationDir, _ := cmd.Flags().GetString("migration-dir")

		m, err := migrate.New(
			"file://"+migrationDir,
			connString,
		)

		if err != nil {
			log.Panic(err)
		}

		m.Up()
	},
}
