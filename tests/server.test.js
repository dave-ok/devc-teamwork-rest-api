// import { expect } from 'chai';
import app from '../src/api';

const request = require('supertest');

describe('The express server', () => {
  describe('when request is made to /', () => {
    it('should respond with status code 200', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err) => {
          if (err) done(err);
          done();
        });
    });
    it('should respond with "Go team!"', (done) => {
      request(app)
        .get('/')
        .expect('Go team!')
        .end((err) => {
          if (err) done(err);
          done();
        });
    });
  });
});
