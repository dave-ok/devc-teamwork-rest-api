export const CREATE_MIGRATIONS_TABLE = `
CREATE TABLE migrations
(
    id integer NOT NULL,
    migrationid character varying(50) NOT NULL,
    objname character varying(50) NOT NULL,
    createsql character varying(255) NOT NULL,
    dropsql character varying(255) NOT NULL,
    CONSTRAINT migrations_pkey PRIMARY KEY (id),
    CONSTRAINT migrations_migrationid_key UNIQUE (migrationid)
);
`;

export const CREATE_DB_VERSION_TABLE = `
CREATE TABLE db_version
(
    version integer,
    id smallint DEFAULT 1,
    CONSTRAINT db_version_id_key UNIQUE (id),
    CONSTRAINT db_version_version_key UNIQUE (version),
    CONSTRAINT db_version_id_check CHECK (id = 1)
)
WITH (
    OIDS=FALSE
);
INSERT INTO db_version(id) values(1);
`
export const CREATE_SCHEMA_PUBLIC = 
`CREATE SCHEMA public
AUTHORIZATION postgres;                
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;`;