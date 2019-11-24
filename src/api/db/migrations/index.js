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
  CREATE_VW_ARTICLES,
  CREATE_VW_GIFS,
  CREATE_VW_ARTICLE_COMMENTS,
  CREATE_VW_GIF_COMMENTS,
  CREATE_VW_USERS,
  CREATE_VW_USER_ROLES,
  CREATE_VW_ARTICLE_TAGS,
} from '../sql';


import { usersTableSeed, rolesTableSeed, userRolesTableSeed } from '../seeds';
import { DROP_VW_ARTICLES, DROP_VW_GIFS, DROP_VW_ARTICLE_COMMENTS, DROP_VW_GIF_COMMENTS, DROP_VW_ARTICLE_TAGS, DROP_VW_USERS, DROP_VW_USER_ROLES } from './../sql/index';


export const createUsersTable = new Migration(
  'create_users_table',
  'users',
  CREATE_USERS_TABLE,
  DROP_USERS_TABLE,
  usersTableSeed
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
  'article_comments',
  CREATE_ARTICLE_COMMENTS_TABLE,
  DROP_ARTICLE_COMMENTS_TABLE,
);

export const createGifCommentsTable = new Migration(
  'create_gif_comments_table',
  'gif_comments',
  CREATE_GIF_COMMENTS_TABLE,
  DROP_GIF_COMMENTS_TABLE,
);

export const createVwArticles = new Migration(
  'create_vw_articles',
  'vw_articles',
  CREATE_VW_ARTICLES,
  DROP_VW_ARTICLES
);

export const createArticleTagsTable = new Migration(
  'create_article_tags_table',
  'article_tags',
  CREATE_ARTICLE_TAGS_TABLE,
  DROP_ARTICLE_TAGS_TABLE,
);

export const createRolesTable = new Migration(
  'create_roles_table',
  'roles',
  CREATE_ROLES_TABLE,
  DROP_ROLES_TABLE,
  rolesTableSeed
);

export const createUserRolesTable = new Migration(
  'create_user_roles_table',
  'user_roles',
  CREATE_USER_ROLES_TABLE,
  DROP_USER_ROLES_TABLE,
  userRolesTableSeed
);

export const createVwGifs = new Migration(
  'create_vw_gifs',
  'vw_gifs',
  CREATE_VW_GIFS,
  DROP_VW_GIFS
);

export const createVwArticleComments = new Migration(
  'create_vw_article_comments',
  'vw_article_comments',
  CREATE_VW_ARTICLE_COMMENTS,
  DROP_VW_ARTICLE_COMMENTS
);

export const createVwGifComments = new Migration(
  'create_vw_gif_comments',
  'vw_gif_comments',
  CREATE_VW_GIF_COMMENTS,
  DROP_VW_GIF_COMMENTS
);

export const createVwArticleTags = new Migration(
  'create_vw_article_tags',
  'vw_article_tags',
  CREATE_VW_ARTICLE_TAGS,
  DROP_VW_ARTICLE_TAGS
);

export const createVwUsers = new Migration(
  'create_vw_users',
  'vw_users',
  CREATE_VW_USERS,
  DROP_VW_USERS
);

export const createVwUserRoles = new Migration(
  'create_vw_user_roles',
  'vw_user_roles',
  CREATE_VW_USER_ROLES,
  DROP_VW_USER_ROLES
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
  createVwUsers,
  createVwUserRoles,
  createVwArticles,
  createVwGifs,
  createVwArticleComments,
  createVwGifComments,
  createVwArticleTags,
];
