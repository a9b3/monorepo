package logger

import (
	"os"

	"github.com/rs/zerolog"
	log "github.com/rs/zerolog/log"
	"github.com/rs/zerolog/pkgerrors"
)

type Fields = map[string]interface{}

var (
	// Maintain a reference to a logger instance, this allows us to create new
	// loggers and assign to this variable which is referenced by the public api.
	logger = log.Logger
)

func Configure(level string, namespace string, debug bool) {
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	zerolog.ErrorStackMarshaler = pkgerrors.MarshalStack

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

func PanicWithFields(err error, msg string, fields Fields) {
	logger.Panic().Err(err).Fields(fields).Msg(msg)
}

func FatalWithFields(err error, msg string, fields Fields) {
	logger.Fatal().Err(err).Fields(fields).Msg(msg)
}

func ErrorWithFields(err error, msg string, fields Fields) {
	logger.Error().Err(err).Fields(fields).Msg(msg)
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

func Panic(err error, msg string) {
	logger.Panic().Stack().Err(err).Msg(msg)
}

func Fatal(err error, msg string) {
	logger.Fatal().Stack().Err(err).Msg(msg)
}

func Error(err error, msg string) {
	logger.Error().Stack().Err(err).Msg(msg)
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
