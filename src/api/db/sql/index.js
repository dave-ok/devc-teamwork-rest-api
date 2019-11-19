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

export const CREATE_USERS_TABLE = 
`CREATE TABLE public.users
(
  userid integer NOT NULL DEFAULT nextval('users_userid_seq'::regclass),
  firstname character varying(50) NOT NULL,
  lastname character varying(50) NOT NULL,
  email character varying(100) NOT NULL,
  password character varying NOT NULL,
  gender character(1) NOT NULL,
  jobrole character varying(50) NOT NULL,
  department character varying(50) NOT NULL,
  address character varying NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (userid),
  CONSTRAINT users_email_key UNIQUE (email),
  CONSTRAINT users_gender_check CHECK (gender = 'M'::bpchar OR gender = 'F'::bpchar)
)
WITH (
  OIDS=FALSE
);`;

export const DROP_USERS_TABLE =
`DROP TABLE public.users;`;

export const CREATE_ARTICLES_TABLE =
`CREATE TABLE public.articles
(
  articleid integer NOT NULL DEFAULT nextval('articles_articleid_seq'::regclass),
  article character varying NOT NULL,
  title character varying(100) NOT NULL,
  date_created timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT articles_pkey PRIMARY KEY (articleid)
)
WITH (
  OIDS=FALSE
);
`

export const DROP_ARTICLES_TABLE = 
`DROP TABLE public.articles;`

export const CREATE_GIFS_TABLE = 
`CREATE TABLE public.gifs
(
  gifid integer NOT NULL DEFAULT nextval('gifs_gifid_seq'::regclass),
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
export const DROP_GIFS_TABLE = `DROP TABLE public.gifs;`;

export const CREATE_TAGS_TABLE = 
`CREATE TABLE public.tags
(
  tagid integer NOT NULL DEFAULT nextval('tags_tagid_seq'::regclass),
  tag character varying(50) NOT NULL,
  CONSTRAINT tags_pkey PRIMARY KEY (tagid)
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_TAGS_TABLE = `DROP TABLE public.tags;`;

export const CREATE_ARTICLE_COMMENTS_TABLE = 
`CREATE TABLE public.articlecomments
(
  articlecommentid integer NOT NULL DEFAULT nextval('articlecomments_articlecommentid_seq'::regclass),
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

export const DROP_ARTICLE_COMMENTS_TABLE = `DROP TABLE public.articlecomments;`;

export const CREATE_GIF_COMMENTS_TABLE = 
`CREATE TABLE public.gifcomments
(
  gifcommentid integer NOT NULL DEFAULT nextval('gifcomments_gifcommentid_seq'::regclass),
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
export const DROP_GIF_COMMENTS_TABLE = `DROP TABLE public.gifcomments;`;

export const CREATE_ARTICLE_TAGS_TABLE = 
`CREATE TABLE public.articletags
(
  articletagid integer NOT NULL DEFAULT nextval('articletags_articletagid_seq'::regclass),
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
export const DROP_ARTICLE_TAGS_TABLE = `DROP TABLE public.articletags;`;