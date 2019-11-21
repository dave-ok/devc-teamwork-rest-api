export const CREATE_MIGRATIONS_TABLE = `
CREATE TABLE migrations
(
    id integer NOT NULL,
    migrationid character varying(50) NOT NULL,
    objname character varying(50) NOT NULL,
    createsql character varying NOT NULL,
    dropsql character varying NOT NULL,
    seed character varying NOT NULL,
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
`;
export const CREATE_SCHEMA_PUBLIC = `CREATE SCHEMA public
AUTHORIZATION postgres;                
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
SET search_path TO public`;

export const CREATE_USERS_TABLE = `CREATE TABLE public.users
(
  userid serial,
  firstname character varying(50) NOT NULL,
  lastname character varying(50) NOT NULL,
  email character varying(100) NOT NULL,
  password character varying NOT NULL,
  gender character(1) NOT NULL,
  jobrole character varying(50) NOT NULL,
  department character varying(50) NOT NULL,
  address character varying NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (userid),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_gender_check CHECK (gender = 'M'::bpchar OR gender = 'F'::bpchar)
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_USERS_TABLE = 'DROP TABLE public.users;';

export const CREATE_ARTICLES_TABLE = `CREATE TABLE public.articles
(
  articleid serial,
  article character varying NOT NULL,
  title character varying(100) NOT NULL,
  date_created timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT articles_pkey PRIMARY KEY (articleid)
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_ARTICLES_TABLE = 'DROP TABLE public.articles;';

export const CREATE_GIFS_TABLE = `CREATE TABLE public.gifs
(
  gifid serial,
  imageurl character varying NOT NULL,
  title character varying(100) NOT NULL,
  date_created timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT gifs_pkey PRIMARY KEY (gifid)
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_GIFS_TABLE = 'DROP TABLE public.gifs;';

export const CREATE_TAGS_TABLE = `CREATE TABLE public.tags
(
  tagid serial,
  tag character varying(50) NOT NULL,
  CONSTRAINT tags_pkey PRIMARY KEY (tagid)
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_TAGS_TABLE = 'DROP TABLE public.tags;';

export const CREATE_ARTICLE_COMMENTS_TABLE = `CREATE TABLE public.articlecomments
(
  articlecommentid serial,
  articleid integer NOT NULL,
  userid integer NOT NULL,
  comment character varying(200) NOT NULL,
  datecreated timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT articlecomments_pkey PRIMARY KEY (articlecommentid),
  CONSTRAINT articlecomments_articleid_fkey FOREIGN KEY (articleid)
      REFERENCES public.articles (articleid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT articlecomments_userid_fkey FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_ARTICLE_COMMENTS_TABLE = 'DROP TABLE public.articlecomments;';

export const CREATE_GIF_COMMENTS_TABLE = `CREATE TABLE public.gifcomments
(
  gifcommentid serial,
  gifid integer NOT NULL,
  comment character varying(200) NOT NULL,
  datecreated timestamp without time zone NOT NULL DEFAULT now(),
  userid integer NOT NULL,
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT gifcomments_pkey PRIMARY KEY (gifcommentid),
  CONSTRAINT gifcomments_gifid_fkey FOREIGN KEY (gifid)
      REFERENCES public.gifs (gifid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT gifcomments_userid_fkey FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_GIF_COMMENTS_TABLE = 'DROP TABLE public.gifcomments;';

export const CREATE_ARTICLE_TAGS_TABLE = `CREATE TABLE public.articletags
(
  articletagid serial,
  articleid integer NOT NULL,
  tagid integer NOT NULL,
  CONSTRAINT articletags_pkey PRIMARY KEY (articletagid),
  CONSTRAINT articletags_articleid_fkey FOREIGN KEY (articleid)
      REFERENCES public.articles (articleid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT articletags_tagid_fkey FOREIGN KEY (tagid)
      REFERENCES public.tags (tagid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT articletags_articleid_tagid_key UNIQUE (articleid, tagid)
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_ARTICLE_TAGS_TABLE = 'DROP TABLE public.articletags;';

export const CREATE_ROLES_TABLE = `CREATE TABLE public.roles
(
  roleid serial,
  role character varying(30),
  CONSTRAINT roles_pkey PRIMARY KEY (roleid),
  CONSTRAINT roles_role_key UNIQUE (role)
)
WITH (
  OIDS=FALSE
);`;

export const DROP_ROLES_TABLE = 'DROP TABLE public.roles;';

export const CREATE_USER_ROLES_TABLE = `CREATE TABLE public.userroles
(
  userroleid serial,
  userid integer,
  roleid integer,
  CONSTRAINT userroles_pkey PRIMARY KEY (userroleid),
  CONSTRAINT userroles_roleid_fkey FOREIGN KEY (roleid)
      REFERENCES public.roles (roleid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT userroles_userid_fkey FOREIGN KEY (userid)
      REFERENCES public.users (userid) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT userroles_userid_roleid_key UNIQUE (userid, roleid)
)
WITH (
  OIDS=FALSE
);`;

export const DROP_USER_ROLES_TABLE = 'DROP TABLE public.userroles;';
