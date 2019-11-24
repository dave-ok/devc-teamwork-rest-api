
import { expect } from 'chai';
import GifComment from '../../../../src/api/v1/models/gifcomment.model';
import db from '../../../../src/api/db';

describe('GifComment model', () => {
  let lastGifId;

  before(async () => {
    const result = await db.query(`
        insert into gifs(image_url, title, user_id) 
        values('first gif content', 'title', 1)
        returning gif_id;
    `);

    lastGifId = result.rows[0].gif_id;

    await db.query(`
        insert into gif_comments(gif_id, comment, user_id) 
        values(${lastGifId}, 'gif comment', 1);
        insert into gif_comments(gif_id, comment, user_id) 
        values(${lastGifId}, 'gif comment 2', 1);
        
    `);
  });

  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "gif_commentid"', () => {
        expect(GifComment.pkfield()).to.be.equal('gif_comment_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "gif_comments"', () => {
        expect(GifComment.viewTable()).to.be.equal('vw_gif_comments');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "gif_comments"', () => {
        expect(GifComment.modifyTable()).to.be.equal('gif_comments');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 4', () => {
        expect(GifComment.modifyFields()).to.be.an('array').with.length(4);
      });
    });
    describe('when getByGifId is called', () => {
      it('should return array with 2 comments', async () => {
        const gifComment = await GifComment.getByGifId(lastGifId);
        expect(gifComment).to.be.an('array').with.length(2);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new gifComment is created', () => {
      let gifComment;
      beforeEach(() => {
        gifComment = new GifComment();
        gifComment.comment = 'content';
        gifComment.gif_id = lastGifId;
        gifComment.user_id = 1;
      });
      it('should have all specifed fields', () => {
        expect(gifComment).to.haveOwnProperty('gif_comment_id');
        expect(gifComment).to.haveOwnProperty('gif_id');
        expect(gifComment).to.haveOwnProperty('user_id');
        expect(gifComment).to.haveOwnProperty('flagged');
        expect(gifComment).to.haveOwnProperty('created_on');
      });

      it('setting flagged field should be ignored', async () => {
        expect(await gifComment.flag()).to.be.false;
        expect(await gifComment.unflag()).to.be.false;
      });

      describe('after record is created in DB and flag method is called', () => {
        it('should be flagged in DB and locally', async () => {
          await gifComment.save();
          const success = await gifComment.flag();
          const dbRec = await GifComment.getbyId(gifComment.gif_comment_id);

          expect(gifComment.flagged).to.be.true;
          expect(success).to.be.true;
          expect(dbRec.flagged).to.be.true;
        });
      });

      describe('after record is created in DB and unflag method is called', () => {
        it('should be unflagged in DB and locally', async () => {
          await gifComment.save();
          const success = await gifComment.unflag();
          const dbRec = await GifComment.getbyId(gifComment.gif_comment_id);
          expect(gifComment.flagged).to.be.false;
          expect(success).to.be.true;
          expect(dbRec.flagged).to.be.false;
        });
      });
    });
  });

  after(async () => {
    // empty articles table
    await db.query('delete from gifs');
  });
});
