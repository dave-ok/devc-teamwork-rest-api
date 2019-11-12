// import { expect } from 'chai';
import app from '../../../src/api';

const request = require('supertest');

describe('The express server', () => {
  describe('when request is made to /api/v1', () => {
    it('should respond with status code 200', (done) => {
      request(app)
        .get('/api/v1')
        .expect(200)
        .end((err) => {
          if (err) { done(err); } else done();
        });
    });
    it('should respond with "Teamwork V1"', (done) => {
      request(app)
        .get('/api/v1')
        .expect('Teamwork V1')
        .end((err) => {
          if (err) { done(err); } else done();
        });
    });
  });
});
