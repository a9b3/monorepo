/*

During initial development iteration is required.

If you get the error regarding Dirty Database, you will need to go into the
database and drop the schema_migrations table.

kubectl exec -it <db_pod> -- bash
psql -U user
DROP TABLE schema_migrations;

 */
create table if not exists persons(
    id uuid primary key unique not null,
    username varchar (50) not null
);
