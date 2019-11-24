
import { expect } from 'chai';
import ArticleTag from '../../../../src/api/v1/models/articletag.model';
import db from '../../../../src/api/db';

describe('ArticleTag model', () => {
    
    let lastArticleId, lastTagId, lastArticleTagId;

    before(async () => {
        const result = await db.query(`
            insert into articles(article, title, user_id) 
            values('first article content', 'title', 1)
            returning article_id;        
        `);       
        
        lastArticleId = result.rows[0].article_id; 
        
        const tag = await db.query(`
            insert into tags(tag) 
            values('tag1')
            returning tag_id;        
        `);

        lastTagId = tag.rows[0].tag_id;
        
        const comment = await db.query(`
        insert into article_tags(tag_id, article_id)
        values(${lastTagId}, ${lastArticleId})
        returning article_tag_id;
        `);

        lastArticleTagId = result.rows[0].article_tag_id;

    });

  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "article_tag_id"', () => {
        expect(ArticleTag.pkfield()).to.be.equal('article_tag_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "vw_article_tags"', () => {
        expect(ArticleTag.viewTable()).to.be.equal('vw_article_tags');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "article_tags"', () => {
        expect(ArticleTag.modifyTable()).to.be.equal('article_tags');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 2', () => {
        expect(ArticleTag.modifyFields()).to.be.an('array').with.length(2);
      });
    });
    describe('when getbyArticleId is called', () => {
      it('should return array of length 1', async () => {
        const articleTag = await ArticleTag.getbyArticleId(lastArticleId);
        expect(articleTag).to.be.an('array').with.length(1);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new article_tag is created', () => {
        let article_tag;
        before(() => {
            article_tag = new ArticleTag();
        });
        it('should have all specifed fields', () => {
            expect(article_tag).to.haveOwnProperty('article_tag_id');
            expect(article_tag).to.haveOwnProperty('article_id');
            expect(article_tag).to.haveOwnProperty('tag_id');
        })
    });
  });

  after(async () => {
      await db.query('delete from articles');
      await db.query('delete from tags');
  })
});
