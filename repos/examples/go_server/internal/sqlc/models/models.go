// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.13.0

package models

import (
	"time"

	"github.com/google/uuid"
)

type Person struct {
	ID        uuid.UUID
	Username  string
	CreatedAt time.Time
	UpdatedAt time.Time
}
