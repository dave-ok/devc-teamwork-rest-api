import request from 'supertest';
import { expect } from 'chai';
import customEnv from 'custom-env';
import app from '../../../../src/api';
import { generateToken } from '../../../../src/api/v1/controllers/authController';
import Article from '../../../../src/api/v1/models/article.model';
import db from '../../../../src/api/db';

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

    describe('when an authenticated user requests to edit a non-existent article', () => {
      it('should return error that article not found', (done) => {
        request(app)
          .patch(`/api/v1/articles/777`)
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
            expect(res.body.error).to.contain('not found');
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

  describe('GET: /articles/:id', () => {
    describe('when an unauthenticated user requests to view an article', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .get(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
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

    describe('when an authenticated user requests to view a non-existent article', () => {
      it('should return error that article not found', (done) => {
        request(app)
          .get('/api/v1/articles/777')
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('not found');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to view an existing article', () => {
      let janeArticleID;
      before(async () => {
        // add an article and add comments
        const article = new Article();
        article.title = `Jane's first article`;
        article.article = 'The world is your playground';
        article.user_id = 2;
        await article.save();

        janeArticleID = article.article_id;

        await article.addComment(1, 'Hmmm... interesting article, Jane');
        await article.addComment(2, 'Thanks John');
      });
      it('should return article with comments and tags', (done) => {
        request(app)
          .get(`/api/v1/articles/${janeArticleID}`)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('id', janeArticleID);
            expect(res.body.data).to.have.property('title', 'Jane\'s first article');
            expect(res.body.data).to.have.property('article', 'The world is your playground');
            expect(res.body.data).to.have.property('authorName', 'Jane Doe');
            expect(res.body.data).to.have.property('comments').with.length(2);
            expect(res.body.data).to.have.property('tags');

            return done();
          });
      });
    });
  });

  describe('GET: /articles/', () => {
    describe('when an unauthenticated user requests to view all articles', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .get('/api/v1/articles/')
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


    describe('when an authenticated user requests to view all articles', () => {
      
      describe('when articles exist in DB', () => {
        before(async () => {
          // add one more article
          const article = new Article();
          article.title = 'Another Article';
          article.article = 'Another article content';
          article.user_id = 2;
          await article.save();
        });

        it('should return all articles', (done) => {
          request(app)
            .get('/api/v1/articles/')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .expect(200)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
  
              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('articles').that.is.an('array');
              expect(res.body.data).to.have.property('articles').that.is.not.empty;
              return done();
            });
        });
      });     
      
      describe('when no articles in DB', () => {
        // delete all articles
        before(async () => {
            await db.query('DELETE FROM ARTICLES');
        });

        it('should return empty array with message', (done) => {
          request(app)
          .get('/api/v1/articles/')
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('articles').that.is.an('array');
            expect(res.body.data).to.have.property('articles').that.is.empty;
            expect(res.body.data).to.have.property('message', 'No articles found');

            return done();

          });        
        });
      });
    });
  });

  describe('DELETE: /articles/:id', () => {
    before(async () => {
      // add one more article
      const article = new Article();
      article.title = 'A New Article';
      article.article = 'Admin article content';
      article.user_id = 1;
      await article.save();
      ADMIN_ARTICLE_ID = article.article_id;
    });

    describe('when an unauthenticated user requests to delete an article', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .delete(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
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

    describe('when an authenticated user requests to delete someone else\'s article', () => {
      it('should return error that article not found among owned articles', (done) => {
        request(app)
          .delete(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
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

    describe('when an authenticated user requests to delete a non-existent article', () => {
      it('should return error that article not found among owned articles', (done) => {
        request(app)
          .delete(`/api/v1/articles/777`)
          .set('Authorization', `Bearer ${USER_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('not found');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to delete their own article', () => {
      it('should return successfully deleted message', (done) => {
        request(app)
          .delete(`/api/v1/articles/${ADMIN_ARTICLE_ID}`)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('message', 'Article succesfully deleted');

            return done();
          });
      });
    });
  });
});
