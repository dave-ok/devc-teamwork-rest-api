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

export const CREATE_USERS_TABLE = `CREATE TABLE public.users
(
  user_id serial,
  first_name character varying(50) NOT NULL,
  last_name character varying(50) NOT NULL,
  email character varying(100) NOT NULL,
  password character varying NOT NULL,
  gender character(1) NOT NULL,
  job_role character varying(50) NOT NULL,
  department character varying(50) NOT NULL,
  address character varying NOT NULL,
  CONSTRAINT users_pkey PRIMARY KEY (user_id),
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
  article_id serial,
  article character varying NOT NULL,
  title character varying(100) NOT NULL,
  created_on timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  user_id integer NOT NULL,
  CONSTRAINT articles_pkey PRIMARY KEY (article_id),
  CONSTRAINT articles_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_ARTICLES_TABLE = 'DROP TABLE public.articles;';

export const CREATE_GIFS_TABLE = `CREATE TABLE public.gifs
(
  gif_id serial,
  image_url character varying NOT NULL,
  title character varying(100) NOT NULL,
  created_on timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  user_id integer NOT NULL,
  CONSTRAINT gifs_pkey PRIMARY KEY (gif_id),
  CONSTRAINT gifs_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_GIFS_TABLE = 'DROP TABLE public.gifs;';

export const CREATE_TAGS_TABLE = `CREATE TABLE public.tags
(
  tag_id serial,
  tag character varying(50) NOT NULL,
  CONSTRAINT tags_pkey PRIMARY KEY (tag_id)
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_TAGS_TABLE = 'DROP TABLE public.tags;';

export const CREATE_ARTICLE_COMMENTS_TABLE = `CREATE TABLE public.article_comments
(
  article_comment_id serial,
  article_id integer NOT NULL,
  user_id integer NOT NULL,
  comment character varying(200) NOT NULL,
  created_on timestamp without time zone NOT NULL DEFAULT now(),
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT article_comments_pkey PRIMARY KEY (article_comment_id),
  CONSTRAINT article_comments_article_id_fkey FOREIGN KEY (article_id)
      REFERENCES public.articles (article_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT article_comments_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;

export const DROP_ARTICLE_COMMENTS_TABLE = 'DROP TABLE public.article_comments;';

export const CREATE_GIF_COMMENTS_TABLE = `CREATE TABLE public.gif_comments
(
  gif_comment_id serial,
  gif_id integer NOT NULL,
  comment character varying(200) NOT NULL,
  created_on timestamp without time zone NOT NULL DEFAULT now(),
  user_id integer NOT NULL,
  flagged boolean NOT NULL DEFAULT false,
  CONSTRAINT gif_comments_pkey PRIMARY KEY (gif_comment_id),
  CONSTRAINT gif_comments_gif_id_fkey FOREIGN KEY (gif_id)
      REFERENCES public.gifs (gif_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT gif_comments_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_GIF_COMMENTS_TABLE = 'DROP TABLE public.gif_comments;';

export const CREATE_ARTICLE_TAGS_TABLE = `CREATE TABLE public.article_tags
(
  article_tag_id serial,
  article_id integer NOT NULL,
  tag_id integer NOT NULL,
  CONSTRAINT article_tags_pkey PRIMARY KEY (article_tag_id),
  CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id)
      REFERENCES public.articles (article_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id)
      REFERENCES public.tags (tag_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT article_tags_article_id_tag_id_key UNIQUE (article_id, tag_id)
)
WITH (
  OIDS=FALSE
);
`;
export const DROP_ARTICLE_TAGS_TABLE = 'DROP TABLE public.article_tags;';

export const CREATE_ROLES_TABLE = `CREATE TABLE public.roles
(
  role_id serial,
  role character varying(30),
  CONSTRAINT roles_pkey PRIMARY KEY (role_id),
  CONSTRAINT roles_role_key UNIQUE (role)
)
WITH (
  OIDS=FALSE
);`;

export const DROP_ROLES_TABLE = 'DROP TABLE public.roles;';

export const CREATE_USER_ROLES_TABLE = `CREATE TABLE public.user_roles
(
  user_role_id serial,
  user_id integer,
  role_id integer,
  CONSTRAINT user_roles_pkey PRIMARY KEY (user_role_id),
  CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id)
      REFERENCES public.roles (role_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id)
      REFERENCES public.users (user_id) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id)
)
WITH (
  OIDS=FALSE
);`;

export const DROP_USER_ROLES_TABLE = 'DROP TABLE public.user_roles;';

export const CREATE_VW_ARTICLES = `
CREATE OR REPLACE VIEW public.vw_articles AS 
 SELECT articles.article_id,
    articles.article,
    articles.title,
    articles.created_on,
    articles.flagged,
    articles.user_id,
    articles.user_id AS author_id,
    (users.first_name::text || ' '::text) || users.last_name::text AS author_name,
    users.email
   FROM articles,
    users
  WHERE articles.user_id = users.user_id;
`;

export const DROP_VW_ARTICLES = 'DROP VIEW public.vw_articles';

export const CREATE_VW_GIFS = `
CREATE OR REPLACE VIEW public.vw_gifs AS 
 SELECT gifs.gif_id,
    gifs.image_url,
    gifs.title,
    gifs.created_on,
    gifs.flagged,
    gifs.user_id,
    gifs.user_id as author_id,
    (users.first_name::text || ' '::text) || users.last_name::text AS author_name,
    users.email
   FROM gifs,
    users
  WHERE gifs.user_id = users.user_id;
`;

export const DROP_VW_GIFS = 'DROP VIEW public.vw_gifs;';

export const CREATE_VW_USERS = `
CREATE OR REPLACE VIEW public.vw_users AS 
 SELECT (users.first_name::text || ' '::text) || users.last_name::text AS user_name,
    users.email,
    users.user_id,
    users.job_role,
    users.department,
    users.password,
    users.address,
        CASE users.gender
            WHEN 'M'::bpchar THEN 'Male'::text
            WHEN 'F'::bpchar THEN 'Female'::text
            ELSE NULL::text
        END AS gender
   FROM users;
`;

export const DROP_VW_USERS = 'DROP VIEW public.vw_users;';

export const CREATE_VW_GIF_COMMENTS = `
CREATE OR REPLACE VIEW public.vw_gif_comments AS 
 SELECT gif_comments.gif_comment_id AS comment_id,
    gif_comments.gif_comment_id,
    gif_comments.gif_id,
    gif_comments.comment,
    gif_comments.created_on,
    gif_comments.user_id,
    gif_comments.user_id AS author_id,
    gif_comments.flagged,
    vw_users.user_name,
    vw_users.email,
    vw_users.job_role,
    vw_users.department,
    vw_users.gender
   FROM gif_comments,
    vw_users
  WHERE vw_users.user_id = gif_comments.user_id;

`;

export const DROP_VW_GIF_COMMENTS = 'DROP VIEW public.vw_gif_comments;';

export const CREATE_VW_ARTICLE_COMMENTS = `
CREATE OR REPLACE VIEW public.vw_article_comments AS 
 SELECT article_comments.article_comment_id AS comment_id,
    article_comments.article_comment_id,
    article_comments.article_id,
    article_comments.user_id,
    article_comments.user_id AS author_id,
    article_comments.comment,
    article_comments.created_on,
    article_comments.flagged,
    vw_users.user_name AS author_name,
    vw_users.email,
    vw_users.job_role,
    vw_users.department,
    vw_users.gender
   FROM article_comments,
    vw_users
  WHERE vw_users.user_id = article_comments.user_id;
`;

export const DROP_VW_ARTICLE_COMMENTS = 'DROP VIEW public.vw_article_comments;';

export const CREATE_VW_ARTICLE_TAGS = `
CREATE OR REPLACE VIEW public.vw_article_tags AS 
 SELECT article_tags.article_tag_id,
    article_tags.tag_id,
    tags.tag,
    vw_articles.article_id,
    vw_articles.article,
    vw_articles.title,
    vw_articles.created_on,
    vw_articles.flagged,
    vw_articles.author_id,
    vw_articles.author_name,
    vw_articles.email
   FROM article_tags,
    tags,
    vw_articles
  WHERE tags.tag_id = article_tags.tag_id AND vw_articles.article_id = article_tags.article_id;
`;

export const DROP_VW_ARTICLE_TAGS = 'DROP VIEW public.vw_article_tags;';

export const CREATE_VW_USER_ROLES = `
CREATE OR REPLACE VIEW public.vw_user_roles AS 
 SELECT user_roles.user_role_id,
    user_roles.user_id,
    user_roles.role_id,
    roles.role,
    roles.role AS permissions,
    vw_users.user_name,
    vw_users.email
   FROM user_roles,
    vw_users,
    roles
  WHERE vw_users.user_id = user_roles.user_id AND roles.role_id = user_roles.role_id;
`;

export const DROP_VW_USER_ROLES = 'DROP VIEW public.vw_user_roles;';
