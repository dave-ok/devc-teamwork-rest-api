
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
    describe('when new gif_comment is created', () => {
        let gif_comment;
        beforeEach(() => {
            gif_comment = new GifComment();
            gif_comment.comment = 'content';
            gif_comment.gif_id = lastGifId;
            gif_comment.user_id = 1;
        });
        it('should have all specifed fields', () => {
            expect(gif_comment).to.haveOwnProperty('gif_comment_id');
            expect(gif_comment).to.haveOwnProperty('gif_id');            
            expect(gif_comment).to.haveOwnProperty('user_id');
            expect(gif_comment).to.haveOwnProperty('flagged');
            expect(gif_comment).to.haveOwnProperty('created_on');            
        });

        it('setting flagged field should be ignored', async () => {
            expect(await gif_comment.flag()).to.be.false;
            expect(await gif_comment.unflag()).to.be.false;
        });

        describe('after record is created in DB and flag method is called', () => {            
            it('should be flagged in DB and locally', async () => {
                await gif_comment.save();                
                const success = await gif_comment.flag();                
                const dbRec = await GifComment.getbyId(gif_comment.gif_comment_id);
                
                expect(gif_comment.flagged).to.be.true;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.true;
            });
        });

        describe('after record is created in DB and unflag method is called', () => {            
            it('should be unflagged in DB and locally', async () => {
                await gif_comment.save();
                const success = await gif_comment.unflag();
                const dbRec = await GifComment.getbyId(gif_comment.gif_comment_id);
                expect(gif_comment.flagged).to.be.false;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.false;
            });
        });
        
    });
  });

  after(async () => {    
    //empty articles table
    await db.query('delete from gifs');
  });
});
