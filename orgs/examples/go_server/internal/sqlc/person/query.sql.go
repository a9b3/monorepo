// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.13.0
// source: query.sql

package person

import (
	"context"

	"github.com/google/uuid"
)

const createPerson = `-- name: CreatePerson :one
insert into persons (
    id, username
) values (
  $1, $2
)
returning id, username, created_at, updated_at
`

type CreatePersonParams struct {
	ID       uuid.UUID
	Username string
}

func (q *Queries) CreatePerson(ctx context.Context, arg CreatePersonParams) (Person, error) {
	row := q.db.QueryRow(ctx, createPerson, arg.ID, arg.Username)
	var i Person
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.CreatedAt,
		&i.UpdatedAt,
	)
	return i, err
}

const getPersons = `-- name: GetPersons :many
select id, username, created_at, updated_at from persons
order by created_at
`

func (q *Queries) GetPersons(ctx context.Context) ([]Person, error) {
	rows, err := q.db.Query(ctx, getPersons)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Person
	for rows.Next() {
		var i Person
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.CreatedAt,
			&i.UpdatedAt,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
