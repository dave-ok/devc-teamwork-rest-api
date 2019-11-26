import request from 'supertest';
import { expect } from 'chai';
import customEnv from 'custom-env';
import app from '../../../../src/api';

customEnv.env('test');

describe('Articles resource endpoints integration tests', () => {
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
            .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
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
            .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('articleId');
              expect(res.body.data).to.have.property('createdOn');
              expect(res.body.data).to.have.property('title');
              expect(res.body.data).to.have.property('message', 'Article succesfully created');

              return done();
            });
        });
      });
    });
  });
});
