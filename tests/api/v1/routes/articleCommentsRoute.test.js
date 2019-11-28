import { expect } from 'chai';
import request from 'supertest';
import Article from '../../../../src/api/v1/models/article.model';
import { generateToken } from '../../../../src/api/v1/controllers/authController';
import app from '../../../../src/api';

describe('Article comments resource endpoints integration tests', () => {
  // generate tokens for admin and jane doe
  let ADMIN_TOKEN;
  let USER_TOKEN;
  let ADMIN_ARTICLE_ID;
  // let USER_ARTICLE_ID;

  before(async () => {
    ADMIN_TOKEN = generateToken(
      {
        user_id: 1,
        email: 'johndoe@domain.com',
        permissions: ['admin'],
      },
    );

    USER_TOKEN = generateToken(
      {
        user_id: 2,
        email: 'jane@doe.com',
      },
    );

    const adminArticle = new Article();
    adminArticle.title = 'Admin article';
    adminArticle.article = 'Article content';
    adminArticle.user_id = 1;
    await adminArticle.save();

    ADMIN_ARTICLE_ID = adminArticle.article_id;

    const userArticle = new Article();
    userArticle.title = 'User article';
    userArticle.article = 'Article content';
    userArticle.user_id = 2;
    await userArticle.save();

    // USER_ARTICLE_ID = userArticle.article_id;
  });

  describe('POST: /articles/:articleId/comments', () => {
    describe('when an unauthenticated user requests to comment on an article', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post(`/api/v1/articles/${ADMIN_ARTICLE_ID}/comments`)
          .send({
            comment: 'comment',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to comment on an article', () => {
      describe('and comment is invalid', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .post(`/api/v1/articles/${ADMIN_ARTICLE_ID}/comments`)
            .send({
              comment: '',
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .expect('Content-Type', /json/)
            .expect(422)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              expect(res.body).to.have.property('status', 'error');
              expect(res.body.error).to.be.an('array');
              return done();
            });
        });
      });
      describe('when comment is valid', () => {
        it('should return success and data-> articleTitle, article ... etc', (done) => {
          request(app)
            .post(`/api/v1/articles/${ADMIN_ARTICLE_ID}/comments`)
            .send({
              comment: 'Lookin good boss!',
            })
            // .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${USER_TOKEN}`)
            // .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              ADMIN_ARTICLE_ID = res.body.data.articleId;

              expect(res.body).to.have.property('status', 'success');

              expect(res.body.data).to.have.property('articleTitle');
              expect(res.body.data).to.have.property('article');
              expect(res.body.data).to.have.property('comment');
              expect(res.body.data).to.have.property('createdOn');
              expect(res.body.data).to.have.property('message', 'Comment successfully created');

              return done();
            });
        });
      });
    });
  });
});
