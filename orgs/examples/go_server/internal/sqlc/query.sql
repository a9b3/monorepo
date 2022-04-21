-- name: CreatePerson :one
insert into persons (
    id, username
) values (
  $1, $2
)
returning *;

-- name: GetPersons :many
select * from persons
order by created_at;
