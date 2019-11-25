import request from 'supertest';
import { expect } from 'chai';
import customEnv from 'custom-env';
import app from '../../../../src/api';

customEnv.env('test');


describe('Auth resource endpoints integration tests', () => {
  describe('POST: auth/create-user', () => {
    describe('when an unauthenticated user requests to create user', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post('/api/v1/auth/create-user')
          .send({
            firstName: 'Jack',
            lastName: 'Bauer',
            email: 'me@gmail.com',
            password: 'myPassword',
            gender: 'M',
            jobRole: 'Helpdesk',
            department: 'IT',
            address: '4 somewhere street',
          })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(401)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            done();
          });
      });
    });
    describe('when an authenticated/unauthorized user requests to create user', () => {
      it('should reply with error "Permission denied", 403', (done) => {
        request(app)
          .post('/api/v1/auth/create-user')
          .send({
            firstName: 'Jack',
            lastName: 'Bauer',
            email: 'me@gmail.com',
            password: 'myPassword',
            gender: 'M',
            jobRole: 'Helpdesk',
            department: 'IT',
            address: '4 somewhere street',
          })
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${process.env.USER_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            if (err) done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('Permission denied');
            done();
          });
      });
    });
    describe('when an authenticated/authorized user requests to create user', () => {
      describe('and data is invalid', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .post('/api/v1/auth/create-user')
            .send({
              // "firstName": "Jack", no first name
              lastName: 'Bauer',
              email: 'metoomail', // wrong mail
              password: 'myPassw', // short password
              gender: 'A', // invalid gender
              jobRole: 'Helpdesk',
              department: 'IT',
              // "address": "4 somewhere street" required
            })
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
            .expect('Content-Type', /json/)
            .expect(422)
            .end((err, res) => {
              if (err) done(err);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body.error).to.be.an('array');
              done();
            });
        });
      });
      describe('when data is valid', () => {
        it('should return success and data-> userId, token and message', (done) => {
          request(app)
            .post('/api/v1/auth/create-user')
            .send({
              firstName: 'Jack',
              lastName: 'Bauer',
              email: 'me@gmail.com',
              password: 'myPassword',
              gender: 'M',
              jobRole: 'Helpdesk',
              department: 'IT',
              address: '4 somewhere street',
            })
          // .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              if (err) done(err);

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('token');
              expect(res.body.data)
                .to.have.property('message', 'User account succesfully created');
              expect(res.body.data).to.have.property('userId');
              done();
            });
        });
      });
    });
  });
});
