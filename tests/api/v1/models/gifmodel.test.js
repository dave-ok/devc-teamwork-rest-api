
import { expect } from 'chai';
import Gif from '../../../../src/api/v1/models/gif.model';
import db from '../../../../src/api/db';

describe('Gif model', () => {

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
      it('should return "gifid"', () => {
        expect(Gif.pkfield()).to.be.equal('gif_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "gifs"', () => {
        expect(Gif.viewTable()).to.be.equal('vw_gifs');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "gifs"', () => {
        expect(Gif.modifyTable()).to.be.equal('gifs');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 4', () => {
        expect(Gif.modifyFields()).to.be.an('array').with.length(4);
      });
    });
    describe('when getGif is called', () => {
      it('should return an object with array property comments of length 2', async () => {
        const gif = await Gif.getGif(lastGifId);
        expect(gif).to.have.property('comments').that.is.an('array').with.length(2);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new gif is created', () => {
        let gif;
        beforeEach(() => {
            gif = new Gif();
            gif.image_url = 'content';
            gif.title = 'first gif';
            gif.user_id = 1;
        });
        it('should have all specifed fields', () => {
            expect(gif).to.haveOwnProperty('gif_id');
            expect(gif).to.haveOwnProperty('image_url');
            expect(gif).to.haveOwnProperty('title');
            expect(gif).to.haveOwnProperty('user_id');
            expect(gif).to.haveOwnProperty('flagged');
            expect(gif).to.haveOwnProperty('created_on');            
        });

        it('setting flagged field should be ignored', async () => {
            expect(await gif.flag()).to.be.false;
            expect(await gif.unflag()).to.be.false;
        });

        describe('after record is created in DB and flag method is called', () => {            
            it('should be flagged in DB and locally', async () => {
                await gif.save();                
                const success = await gif.flag();                
                const dbRec = await Gif.getbyId(gif.gif_id);
                
                expect(gif.flagged).to.be.true;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.true;
            });
        });

        describe('after record is created in DB and unflag method is called', () => {            
            it('should be unflagged in DB and locally', async () => {
                await gif.save();
                const success = await gif.unflag();
                const dbRec = await Gif.getbyId(gif.gif_id);
                expect(gif.flagged).to.be.false;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.false;
            });
        });
    });
  });

  after(async () => {
    await db.query('delete from gifs');
  });
  
});
