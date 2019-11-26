import request from 'supertest';
import { expect } from 'chai';
import customEnv from 'custom-env';
import app from '../../../../src/api';
import { generateToken } from '../../../../src/api/v1/controllers/authController';

customEnv.env('test');

describe('Articles resource endpoints integration tests', () => {
  // generate tokens for admin and jane doe
  let ADMIN_TOKEN; let USER_TOKEN; let
    ADMIN_ARTICLE_ID;

  before(() => {
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
  });

  describe('POST: /articles', () => {
    describe('when an unauthenticated user requests to create an article', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post('/api/v1/articles')
          .send({
            title: 'A title',
            article: 'Article Content',
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

    describe('when an authenticated user requests to create an article', () => {
      describe('and data is invalid', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .post('/api/v1/articles')
            .send({
              // "title": "Article Title", no title
              article: 'An article with no title',
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
      describe('when data is valid', () => {
        it('should return success and data-> userId, articleId and title', (done) => {
          request(app)
            .post('/api/v1/articles')
            .send({
              title: 'Article Title',
              article: 'New article content',
            })
          // .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              ADMIN_ARTICLE_ID = res.body.data.articleId;

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('articleId');
              expect(res.body.data).to.have.property('createdOn');
              expect(res.body.data).to.have.property('title');
              expect(res.body.data).to.have.property('message', 'Article succesfully posted');

              return done();
            });
        });
      });
    });
  });

  describe('PATCH: /articles/:id', () => {
    describe('when an unauthenticated user requests to edit an article', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .patch(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
          .send({
            title: 'A title',
            article: 'Article Content',
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

    describe('when an authenticated user requests to edit someone else\'s article', () => {
      it('should return error that article not found among owned articles', (done) => {
        request(app)
          .patch(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
          .send({
            title: 'Article Title',
            article: 'An article with no title',
          })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${USER_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('not found among');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to edit their own article', () => {
      describe('and data is invalid', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .patch(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
            .send({
              // "title": "Article Title", no title
              article: 'An article with no title',
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
      describe('when data is valid', () => {
        it('should return success and data-> userId, articleId and title', (done) => {
          request(app)
            .patch(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
            .send({
              title: 'Article Title',
              article: 'Edited article content',
            })
          // .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('article');
              expect(res.body.data).to.have.property('title');
              expect(res.body.data).to.have.property('message', 'Article succesfully updated');

              return done();
            });
        });
      });
    });
  });
});
