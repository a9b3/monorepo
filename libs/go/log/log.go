package log

import (
	"os"

	"github.com/rs/zerolog"
	log "github.com/rs/zerolog/log"
)

func SetGlobalLevel(level string) {
	l, err := zerolog.ParseLevel(level)
	if err != nil {
		os.Exit(0)
	}
	zerolog.SetGlobalLevel(l)
}

func EnablePrettyLogging() {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
}

func Panic(msg string) {
	log.Panic().Msg(msg)
}

func Fatal(msg string) {
	log.Fatal().Msg(msg)
}

func Error(msg string) {
	log.Error().Msg(msg)
}

func Warn(msg string) {
	log.Warn().Msg(msg)
}

func Info(msg string) {
	log.Info().Msg(msg)
}

func Debug(msg string) {
	log.Debug().Msg(msg)
}

func Trace(msg string) {
	log.Trace().Msg(msg)
}
