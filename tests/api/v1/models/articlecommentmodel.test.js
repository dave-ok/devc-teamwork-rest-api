
import { expect } from 'chai';
import ArticleComment from '../../../../src/api/v1/models/articlecomment.model';
import db from '../../../../src/api/db';

describe('ArticleComment model', () => {
  let lastArticleId;

  before(async () => {
    const result = await db.query(`
        insert into articles(article, title, user_id) 
        values('first article content', 'title', 1)
        returning article_id;        
    `);

    lastArticleId = result.rows[0].article_id;

    await db.query(`
      insert into article_comments(comment, user_id, article_id)
      values('first comment', 2, ${lastArticleId})
      returning article_comment_id;
    `);
  });

  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "article_commentid"', () => {
        expect(ArticleComment.pkfield()).to.be.equal('article_comment_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "article_comments"', () => {
        expect(ArticleComment.viewTable()).to.be.equal('vw_article_comments');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "article_comments"', () => {
        expect(ArticleComment.modifyTable()).to.be.equal('article_comments');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 4', () => {
        expect(ArticleComment.modifyFields()).to.be.an('array').with.length(4);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new articleComment is created', () => {
      let articleComment;
      beforeEach(() => {
        articleComment = new ArticleComment();
        articleComment.comment = 'content';
        articleComment.article_id = lastArticleId;
        articleComment.user_id = 1;
      });
      it('should have all specifed fields', () => {
        expect(articleComment).to.haveOwnProperty('article_comment_id');
        expect(articleComment).to.haveOwnProperty('article_id');
        expect(articleComment).to.haveOwnProperty('user_id');
        expect(articleComment).to.haveOwnProperty('flagged');
        expect(articleComment).to.haveOwnProperty('created_on');
      });

      it('setting flagged field should be ignored', async () => {
        expect(await articleComment.flag()).to.be.false;
        expect(await articleComment.unflag()).to.be.false;
      });

      describe('after record is created in DB and flag method is called', () => {
        it('should be flagged in DB and locally', async () => {
          await articleComment.save();
          const success = await articleComment.flag();
          const dbRec = await ArticleComment.getbyId(articleComment.article_comment_id);

          expect(articleComment.flagged).to.be.true;
          expect(success).to.be.true;
          expect(dbRec.flagged).to.be.true;
        });
      });

      describe('after record is created in DB and unflag method is called', () => {
        it('should be unflagged in DB and locally', async () => {
          await articleComment.save();
          const success = await articleComment.unflag();
          const dbRec = await ArticleComment.getbyId(articleComment.article_comment_id);
          expect(articleComment.flagged).to.be.false;
          expect(success).to.be.true;
          expect(dbRec.flagged).to.be.false;
        });
      });
    });
  });

  after(async () => {
    await db.query('delete from articles');
  });
});
