import { expect } from 'chai';
import request from 'supertest';
import { generateToken } from '../../../../src/api/v1/controllers/authController';
import app from '../../../../src/api/index';
import Gif from '../../../../src/api/v1/models/gif.model';

describe('Gifs resource endpoints integration tests', () => {
  // generate tokens for admin and jane doe
  let ADMIN_TOKEN;
  let TEST_IMAGE_GIF;
  let TEST_IMAGE_JPG;
  let USER_TOKEN;
  let ADMIN_GIF_ID;
  // let USER_GIF_ID;

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

    TEST_IMAGE_GIF = `${__dirname}/images/image.gif`;
    TEST_IMAGE_JPG = `${__dirname}/images/image.jpg`;
  });

  describe('POST: /gifs', () => {
    describe('when an unauthenticated user requests to create a gif post', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .post('/api/v1/gifs')
          .field('title', 'Gif title')
          .attach('image', TEST_IMAGE_GIF)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            return done();
          });
      }).timeout(5000);
    });

    describe('when an authenticated user requests to create a gif', () => {
      describe('and image is not gif or title not present', () => {
        it('should return error containing validation errors and code 422', (done) => {
          request(app)
            .post('/api/v1/gifs')
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .attach('image', TEST_IMAGE_JPG)
            .field('title', '')
            .expect(422)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              expect(res.body).to.have.property('status', 'error');
              // expect(res.body.error).to.be.an('array');
              return done();
            });
        }).timeout(5000);
      });
      describe('when data is valid', () => {
        it('should return success and data-> userId, gifId and title', (done) => {
          request(app)
            .post('/api/v1/gifs')
            .field('title', 'My first gif')
            .attach('image', TEST_IMAGE_GIF)
            .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
            .expect(201)
            .end((err, res) => {
              if (err) {
                return done(err);
              }

              // ADMIN_GIF_ID = res.body.data.gifId;

              expect(res.body).to.have.property('status', 'success');
              expect(res.body.data).to.have.property('gifId');
              expect(res.body.data).to.have.property('createdOn');
              expect(res.body.data).to.have.property('title');
              expect(res.body.data).to.have.property('imageUrl');
              expect(res.body.data).to.have.property('message', 'Gif succesfully posted');

              return done();
            });
        }).timeout(25000);
      });
    });
  });

  describe('GET: /gifs/:id', () => {
    describe('when an unauthenticated user requests to view an gif', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .get(`/api/v1/gifs/${ADMIN_GIF_ID}`)
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

    describe('when an authenticated user requests to view a non-existent gif', () => {
      it('should return error that gif not found', (done) => {
        request(app)
          .get('/api/v1/gifs/777')
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

    describe('when an authenticated user requests to view an existing gif', () => {
      let janeGifID;
      before(async () => {
        // add an gif and add comments
        const gif = new Gif();
        gif.title = 'Jane\'s first gif';
        gif.image_url = 'http://some-url.com';
        gif.user_id = 2;
        await gif.save();

        janeGifID = gif.gif_id;

        await gif.addComment(1, 'Hmmm... interesting gif, Jane');
        await gif.addComment(2, 'Thanks John');
      });
      it('should return gif with comments', (done) => {
        request(app)
          .get(`/api/v1/gifs/${janeGifID}`)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('id', janeGifID);
            expect(res.body.data).to.have.property('title', 'Jane\'s first gif');
            expect(res.body.data).to.have.property('imageUrl', 'http://some-url.com');
            expect(res.body.data).to.have.property('authorName', 'Jane Doe');
            expect(res.body.data).to.have.property('comments').with.length(2);

            return done();
          });
      });
    });
  });

  describe('DELETE: /gifs/:id', () => {
    before(async () => {
      // add one more gif
      const gif = new Gif();
      gif.title = 'A New Gif';
      gif.image_url = 'http://some-url';
      gif.user_id = 1;
      await gif.save();
      ADMIN_GIF_ID = gif.gif_id;

      const userGif = new Gif();
      userGif.title = 'A New Gif';
      userGif.image_url = 'http://some-other-url';
      userGif.user_id = 2;
      await userGif.save();
      // USER_GIF_ID = userGif.gif_id;
    });

    describe('when an unauthenticated user requests to delete an gif', () => {
      it('should reply with error no authorization token found, 401', (done) => {
        request(app)
          .delete(`/api/v1/gifs/${ADMIN_GIF_ID}`)
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body.error).to.contain('No authorization token');
            return done();
          });
      });
    });

    describe('when an authenticated user requests to delete someone else\'s gif', () => {
      it('should return error that gif not found among owned gifs', (done) => {
        request(app)
          .delete(`/api/v1/gifs/${ADMIN_GIF_ID}`)
          .set('Authorization', `Bearer ${USER_TOKEN}`)
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

    describe('when an authenticated/authorized user requests to delete a non-existent gif', () => {
      it('should return error that gif not found among owned gifs', (done) => {
        request(app)
          .delete('/api/v1/gifs/777')
          .set('Authorization', `Bearer ${USER_TOKEN}`)
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

    describe('when an authenticated user requests to delete their own gif', () => {
      it('should return successfully deleted message', (done) => {
        request(app)
          .delete(`/api/v1/gifs/${ADMIN_GIF_ID}`)
          .set('Authorization', `Bearer ${ADMIN_TOKEN}`)
          .expect(200)
          .end((err, res) => {
            if (err) {
              return done(err);
            }

            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('message', 'Gif succesfully deleted');

            return done();
          });
      });
    });
  });
});
