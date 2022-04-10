package cmd

import (
	"fmt"
	"os"

	rpc "github.com/publiclabel/monorepo/orgs/examples/go_server/internal/rpc"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var rootCmd = &cobra.Command{
	Use:   "app",
	Short: "gRPC server",
	Long:  `gRPC server`,
	Run: func(cmd *cobra.Command, args []string) {
		port, _ := cmd.Flags().GetString("port")

		rpc.Start(port)
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

	rootCmd.PersistentFlags().String("port", viper.GetString("PORT"), "port to listen to")
}
