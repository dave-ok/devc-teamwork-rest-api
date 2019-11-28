import request from 'supertest';
import { expect } from 'chai';
import customEnv from 'custom-env';
import app from '../../../../src/api';
import { signupUser, generateToken } from '../../../../src/api/v1/controllers/authController';


customEnv.env('test');


describe('Auth resource endpoints integration tests', () => {
  let ADMIN_TOKEN; 
  let USER_TOKEN; 
  let ADMIN_ARTICLE_ID;

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
  describe('POST: /auth/create-user', () => {
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
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            return done();
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
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('Permission denied');
            return done();
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
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('token');
              expect(res.body.data)
                .to.have.property('message', 'User account succesfully created');
              expect(res.body.data).to.have.property('userId');
              return done();
            });
        });
      });
      describe('when data is valid but user already exists', () => {
        it('should throw unique constraint violation error', (done) => {
          request(app)
            .post('/api/v1/auth/create-user')
            .send({
              firstName: 'Jack',
              lastName: 'Bauer',
              email: 'johndoe@domain.com',
              password: 'myPassword',
              gender: 'M',
              jobRole: 'Helpdesk',
              department: 'IT',
              address: '4 somewhere street',
            })
          // .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          // .expect('Content-Type', /json/)
            .expect(409)
            .end((err, res) => {
              if (err) return done(err);

              expect(res.body).to.have.property('status', 'error');
              return done();
            });
        });
      });
    });
  });

  describe('POST: /auth/signin', () => {
    describe('when an unauthenticated/authenticated user requests to sign in', () => {
      // create quick test user
      before(async () => {
        await signupUser({
          firstName: 'Harry',
          lastName: 'Potter',
          email: 'harry@domain.com',
          password: 'patronus',
          gender: 'M',
          department: 'Marketing',
          jobRole: 'marketer',
          address: '2 Hogworth Lane',
        });
      });
      describe('with invalid username', () => {
        it('should return unauthorized, 401 error invalid username or password', (done) => {
          request(app)
            .post('/api/v1/auth/signin')
            .send({
              email: 'dummy@gmail.com',
              password: 'password',
            })
            .expect(401)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body.error).to.contain('Invalid username or password');
              return done();
            });
        });
      });
      describe('with valid username but incorrect password', () => {
        it('should return unauthorized, 401 error invalid username or password', (done) => {
          request(app)
            .post('/api/v1/auth/signin')
            .send({
              email: 'harry@domain.com',
              password: 'password',
            })
            .expect(401)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.have.property('status', 'error');
              expect(res.body.error).to.contain('Invalid username or password');
              return done();
            });
        });
      });
      describe('with valid username and password', () => {
        it('should return status 200 login successful', (done) => {
          request(app)
            .post('/api/v1/auth/signin')
            .send({
              email: 'harry@domain.com',
              password: 'patronus',
            })
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data.message).to.contain('Login successful');
              expect(res.body.data).to.have.property('token');
              return done();
            });
        });
      });
    });
  });
});
