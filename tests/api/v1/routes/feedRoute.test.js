import { expect } from 'chai';
import request from 'supertest';
import app from '../../../../src/api/index';
import { generateToken } from '../../../../src/api/v1/controllers/authController';


describe('Feed resource endpoints integration tests', () => {
  let ADMIN_TOKEN;

  before(() => {
    ADMIN_TOKEN = generateToken(
      {
        user_id: 1,
        email: 'johndoe@domain.com',
        permissions: ['admin'],
      },
    );
  });
  describe('GET: /feed', () => {
    describe('when an unauthenticated user makes a request to view feed', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .get('/api/v1/feed')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            return done();
          });
      });
    });
    describe('when an authenticated user makes a request to view feed', () => {
      it(' and there are posts should reply with rows of articles and gifs', (done) => {
        request(app)
          .get('/api/v1/feed')
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.be.an('array');
            return done();
          });
      });
    });
  });
});
