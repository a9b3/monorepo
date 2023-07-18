package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var rootCmd = &cobra.Command{
	Use:   "app",
	Short: "gRPC server",
	Long:  `gRPC server for running examples`,
	Run: func(cmd *cobra.Command, args []string) {
		port, _ := cmd.Flags().GetString("port")
		loglevel, _ := cmd.Flags().GetString("loglevel")
		debug, _ := cmd.Flags().GetBool("debug")
		connstring, _ := cmd.Flags().GetString("connstring")

		fmt.Println(port, loglevel, debug, connstring)
		// rpc.StartServer(port, loglevel, debug, connstring)
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	viper.AutomaticEnv()
	viper.SetDefault("PORT", "50051")
	viper.SetDefault("LOGLEVEL", "info")
	viper.SetDefault("DEBUG", false)
	viper.SetDefault("CONNSTRING", "")
	viper.SetDefault("MIGRATION_DIR", "")

	rootCmd.PersistentFlags().String("port", viper.GetString("PORT"), "port to listen to can also set env var PORT")
	rootCmd.PersistentFlags().String("loglevel", viper.GetString("LOGLEVEL"), "log level")
	rootCmd.PersistentFlags().Bool("debug", viper.GetBool("DEBUG"), "whether to run server in debug mode or not")
	rootCmd.PersistentFlags().String("connstring", viper.GetString("CONNSTRING"), "postgres connection string ex. postgres://username:password@localhost:5432/database_name")

	// -------------------------------------------------------------------------
	// Subcommands
	// -------------------------------------------------------------------------
	// rootCmd.AddCommand(migrateCmd)
}

func main() {
	Execute()
}
