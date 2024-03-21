db-shell-exec:
	kubectl -n go-server exec postgres-statefulset-0 -it -- bash -c "psql -U user database"

run:
	bazel run //repos/examples/go_server:go_server

# the connstring depends on the minikube service ip. need to find a way to get a
# static ip, or a command that can return just the ip
run-migrate:
	bazel run //repos/examples/go_server:go_server -- migrate \
		--connstring "pgx://user:password@127.0.0.1:60178/database" \
		--migration-dir ${PWD}/migrations

run-migrate-down:
	bazel run //repos/examples/go_server:go_server -- migrate drop \
		--connstring "pgx://user:password@127.0.0.1:60178/database" \
		--migration-dir ${PWD}/migrations

grpcurl-example:
	grpcurl -plaintext 127.0.0.1:60582 example.Persons/GetPersons

create-migration:
	migrate create -ext sql -dir ./internal/sqlc/migrations -seq init

sqlc-generate:
	sqlc generate --file ./internal/sqlc/sqlc.yaml
