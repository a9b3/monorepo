/*

During initial development iteration is required.

If you get the error regarding Dirty Database, you will need to go into the
database and drop the schema_migrations table.

kubectl exec -it <db_pod> -- bash
psql -U user
DROP TABLE schema_migrations;

 */
CREATE TABLE IF NOT EXISTS persons(
    id UUID PRIMARY KEY UNIQUE NOT NULL,
    username VARCHAR (50) NOT NULL
);
