package cmd

import (
	"fmt"
	"os"

	"github.com/publiclabel/monorepo/orgs/examples/go_server/internal/rpc"
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

		fmt.Println(debug)
		rpc.Start(port, loglevel, debug)
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

	rootCmd.PersistentFlags().String("port", viper.GetString("PORT"), "port to listen to can also set env var PORT")
	rootCmd.PersistentFlags().String("loglevel", viper.GetString("LOGLEVEL"), "log level")
	rootCmd.PersistentFlags().Bool("debug", viper.GetBool("DEBUG"), "whether to run server in debug mode or not")
}
