import Migration from '../migration';
import {
  CREATE_USERS_TABLE, CREATE_ARTICLES_TABLE,
  DROP_ARTICLES_TABLE, DROP_GIFS_TABLE, CREATE_GIFS_TABLE,
  CREATE_TAGS_TABLE, CREATE_ARTICLE_COMMENTS_TABLE,
  CREATE_GIF_COMMENTS_TABLE, CREATE_ARTICLE_TAGS_TABLE, CREATE_ROLES_TABLE,
  CREATE_USER_ROLES_TABLE, DROP_USER_ROLES_TABLE,
  DROP_USERS_TABLE, DROP_TAGS_TABLE, DROP_ARTICLE_COMMENTS_TABLE,
  DROP_GIF_COMMENTS_TABLE, DROP_ARTICLE_TAGS_TABLE,
  DROP_ROLES_TABLE,
} from '../sql';


import { usersTableSeed, rolesTableSeed, userRolesTableSeed } from '../seeds';


export const createUsersTable = new Migration(
  'create_users_table',
  'users',
  CREATE_USERS_TABLE,
  DROP_USERS_TABLE,
  usersTableSeed,
);

export const createArticlesTable = new Migration(
  'create_articles_table',
  'articles',
  CREATE_ARTICLES_TABLE,
  DROP_ARTICLES_TABLE,
);

export const createGifsTable = new Migration(
  'create_gifs_table',
  'gifs',
  CREATE_GIFS_TABLE,
  DROP_GIFS_TABLE,
);

export const createTagsTable = new Migration(
  'create_tags_table',
  'tags',
  CREATE_TAGS_TABLE,
  DROP_TAGS_TABLE,
);

export const createArticleCommentsTable = new Migration(
  'create_article_comments_table',
  'articlecomments',
  CREATE_ARTICLE_COMMENTS_TABLE,
  DROP_ARTICLE_COMMENTS_TABLE,
);

export const createGifCommentsTable = new Migration(
  'create_gif_comments_table',
  'gifcomments',
  CREATE_GIF_COMMENTS_TABLE,
  DROP_GIF_COMMENTS_TABLE,
);

export const createArticleTagsTable = new Migration(
  'create_article_tags_table',
  'articletags',
  CREATE_ARTICLE_TAGS_TABLE,
  DROP_ARTICLE_TAGS_TABLE,
);

export const createRolesTable = new Migration(
  'create_roles_table',
  'roles',
  CREATE_ROLES_TABLE,
  DROP_ROLES_TABLE,
  rolesTableSeed,
);

export const createUserRolesTable = new Migration(
  'create_user_roles_table',
  'userroles',
  CREATE_USER_ROLES_TABLE,
  DROP_USER_ROLES_TABLE,
  userRolesTableSeed,
);

export default [
  createUsersTable,
  createArticlesTable,
  createGifsTable,
  createTagsTable,
  createArticleCommentsTable,
  createArticleTagsTable,
  createGifCommentsTable,
  createRolesTable,
  createUserRolesTable,
];
