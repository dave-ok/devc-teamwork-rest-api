// import { expect } from 'chai';
import app from '../../src/api';

const request = require('supertest');

describe('The express server', () => {
  describe('when request is made to /', () => {
    it('should respond with status code 200', (done) => {
      request(app)
        .get('/')
        .expect(200)
        .end((err) => {
          if (err) { done(err); } else done();
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

  describe('when request is made to /gobbledygook', () => {
    it('should respond with status code 404', (done) => {
      request(app)
        .get('/gobbledygook')
        .expect(404)
        .end((err) => {
          if (err) { done(err); } else done();
        });
    });
    it('should respond with "Oops! Resource not found"', (done) => {
      request(app)
        .get('/gobbledygook')
        .expect('Oops! Resource not found')
        .end((err) => {
          if (err) { done(err); } else done();
        });
    });
  });
});
