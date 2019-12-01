import request from 'supertest';
import { expect } from 'chai';
import { generateToken } from '../../../../src/api/v1/controllers/authController';
import Gif from '../../../../src/api/v1/models/gif.model';
import app from '../../../../src/api/index';

describe('Gif comments resource endpoints integration tests', () => {
  // generate tokens for admin and jane doe
  let ADMIN_TOKEN;
  let USER_TOKEN;
  let ADMIN_GIF_ID;
  let USER_GIF_ID;

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

    const adminGif = new Gif();
    adminGif.title = 'Admin gif';
    adminGif.image_url = 'http://res.cloudinary.com/dfsdsfs';
    adminGif.user_id = 1;
    await adminGif.save();

    ADMIN_GIF_ID = adminGif.gif_id;


    const userGif = new Gif();
    userGif.title = 'User gif';
    userGif.image_url = 'http://res.cloudinary.com/dfsdsfs';
    userGif.user_id = 2;
    await userGif.save();

    USER_GIF_ID = userGif.gif_id;
  });

  describe('POST: /gifs/:gifId/comments', () => {
    describe('when an unauthenticated user requests to comment on an gif', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post(`/api/v1/gifs/${ADMIN_GIF_ID}/comments`)
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

    describe('when an authenticated user requests to comment on a gif', () => {
      describe('and comment is invalid', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .post(`/api/v1/gifs/${ADMIN_GIF_ID}/comments`)
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
        it('should return success and data-> gifTitle, gif ... etc', (done) => {
          request(app)
            .post(`/api/v1/gifs/${ADMIN_GIF_ID}/comments`)
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

              ADMIN_GIF_ID = res.body.data.gifId;

              expect(res.body).to.have.property('status', 'success');

              expect(res.body.data).to.have.property('gifTitle');
              expect(res.body.data).to.have.property('comment');
              expect(res.body.data).to.have.property('createdOn');
              expect(res.body.data).to.have.property('message', 'Comment successfully created');

              return done();
            });
        });
      });
    });
  });

  describe('POST: /gifs/:gifId/comments/:commentId/flag', () => {
    let commentId;
    before(async () => {
      const userGif = await Gif.getbyId(USER_GIF_ID);
      commentId = await userGif.addComment(1, 'Nice');
    });

    describe('when an unauthenticated user requests to flag a comment', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/flag`)
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

    describe('when an authenticated user requests to flag their own comment', () => {
      it('should return error that user cannot flag their own comment', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/flag`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('cannot flag');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to flag a non-existent comment', () => {
      it('should return error that comment not found', (done) => {
        request(app)
          .post(`/api/v1/gifs/${ADMIN_GIF_ID}/comments/777/flag`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${USER_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(404)
          .end((err, res) => {
            if (err) {
              console.log(err);
              return done(err);
            }

            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('not found');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to flag another user\'s comment', () => {
      it('should return success message and commentId', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/flag`)
          .set('Authorization', `Bearer ${USER_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('commentId', commentId);
            expect(res.body.data).to.have.property('message', 'Comment successfully flagged');

            return done();
          });
      });
    });
  });

  describe('POST: /gifs/:gifId/comments/:commentId/unflag', () => {
    let commentId;
    before(async () => {
      const userGif = await Gif.getbyId(USER_GIF_ID);
      commentId = await userGif.addComment(1, 'Nice');
    });

    describe('when an unauthenticated user requests to unflag a comment', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/unflag`)
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

    describe('when an authenticated/unauthorized user requests to unflag a comment', () => {
      it('should return error that user does not have permissions', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/unflag`)
          .set('Accept', 'application/json')
          .set('Authorization', `Bearer ${USER_TOKEN}`)
          .expect('Content-Type', /json/)
          .expect(403)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('Permission denied');
            return done();
          });
      });
    });

    describe('when an authenticated/authorized user requests to unflag a non-existent comment', () => {
      it('should return error that comment not found', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/777/unflag`)
          .set('Accept', 'application/json')
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

    describe('when an authenticated/authorized user requests to unflag a comment', () => {
      it('should return success message and commentId', (done) => {
        request(app)
          .post(`/api/v1/gifs/${USER_GIF_ID}/comments/${commentId}/unflag`)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('commentId', commentId);
            expect(res.body.data).to.have.property('message', 'Comment successfully unflagged');

            return done();
          });
      });
    });
  });
});
