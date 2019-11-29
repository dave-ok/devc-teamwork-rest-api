import { expect } from 'chai';
import request from 'supertest';
import { generateToken } from '../../../../src/api/v1/controllers/authController';
import app from '../../../../src/api/index';

describe('Gifs resource endpoints integration tests', () => {
  // generate tokens for admin and jane doe
  let ADMIN_TOKEN;
  let TEST_IMAGE_GIF;
  let TEST_IMAGE_JPG;
  // let USER_TOKEN;
  // let ADMIN_GIF_ID;
  // let USER_ARTICLE_ID;

  before(() => {
    ADMIN_TOKEN = generateToken(
      {
        user_id: 1,
        email: 'johndoe@domain.com',
        permissions: ['admin'],
      },
    );

    /* USER_TOKEN = generateToken(
      {
        user_id: 2,
        email: 'jane@doe.com',
      },
    ); */

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
});
