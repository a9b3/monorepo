package log

import (
	"os"

	"github.com/rs/zerolog"
	log "github.com/rs/zerolog/log"
)

type Fields = map[string]interface{}

var (
	// Maintain a reference to a logger instance, this allows us to create new
	// loggers and assign to this variable which is referenced by the public api.
	logger = log.Logger
)

func Configure(level string, namespace string, debug bool) {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix

	l, err := zerolog.ParseLevel(level)
	if err != nil {
		os.Exit(0)
	}
	zerolog.SetGlobalLevel(l)

	if debug == true {
		logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr}).With().Str("namespace", namespace).Caller().Logger()
	} else {
		logger = log.With().Str("namespace", namespace).Logger()
	}
}

func PanicWithFields(msg string, fields Fields) {
	logger.Panic().Fields(fields).Msg(msg)
}

func FatalWithFields(msg string, fields Fields) {
	logger.Fatal().Fields(fields).Msg(msg)
}

func ErrorWithFields(msg string, fields Fields) {
	logger.Error().Fields(fields).Msg(msg)
}

func WarnWithFields(msg string, fields Fields) {
	logger.Warn().Fields(fields).Msg(msg)
}

func InfoWithFields(msg string, fields Fields) {
	logger.Info().Fields(fields).Msg(msg)
}

func DebugWithFields(msg string, fields Fields) {
	logger.Debug().Fields(fields).Msg(msg)
}

func TraceWithFields(msg string, fields Fields) {
	logger.Trace().Fields(fields).Msg(msg)
}

func Panic(msg string) {
	logger.Panic().Msg(msg)
}

func Fatal(msg string) {
	logger.Fatal().Msg(msg)
}

func Error(msg string) {
	logger.Error().Msg(msg)
}

func Warn(msg string) {
	logger.Warn().Msg(msg)
}

func Info(msg string) {
	logger.Info().Msg(msg)
}

func Debug(msg string) {
	logger.Debug().Msg(msg)
}

func Trace(msg string) {
	logger.Trace().Msg(msg)
}
