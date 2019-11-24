
import { expect } from 'chai';
import Article from '../../../../src/api/v1/models/article.model';
import db from '../../../../src/api/db';

describe('Article model', () => {
  
  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "articleid"', () => {
        expect(Article.pkfield()).to.be.equal('article_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "articles"', () => {
        expect(Article.viewTable()).to.be.equal('vw_articles');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "articles"', () => {
        expect(Article.modifyTable()).to.be.equal('articles');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 4', () => {
        expect(Article.modifyFields()).to.be.an('array').with.length(4);
      });
    });

    describe('when getArticle is called', () => {
      let article, articleId;
      before(async () => {
        //create new article
        const result = await db.query(`
            insert into articles(article, title, user_id) 
            values('first article content', 'title', 1)
            returning article_id;        
        `);   
        
        articleId = result.rows[0].article_id;

        //add 2 comments
        await db.query(`
          insert into article_comments(comment, user_id, article_id)
          values('first comment', 2, ${articleId});
          insert into article_comments(comment, user_id, article_id)
          values('second comment', 1, ${articleId});
        `);        
        
      });
      it('should return article with 2 comments', async () => {
        article = await Article.getArticle(articleId);
        expect(article).to.have.property('comments').that.is.an('array').with.length(2);
      });
      after(async () => {
        await db.query('delete from articles');
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new article is created', () => {
        let article;
        beforeEach(() => {
            article = new Article();
            article.article = 'content';
            article.title = 'first article';
            article.user_id = 1;
        });
        it('should have all specifed fields', () => {
            expect(article).to.haveOwnProperty('article_id');
            expect(article).to.haveOwnProperty('article');
            expect(article).to.haveOwnProperty('title');
            expect(article).to.haveOwnProperty('user_id');
            expect(article).to.haveOwnProperty('flagged');
            expect(article).to.haveOwnProperty('created_on');            
        });

        it('setting flagged field should be ignored', async () => {
            expect(await article.flag()).to.be.false;
            expect(await article.unflag()).to.be.false;
        });

        describe('after record is created in DB and flag method is called', () => {            
            it('should be flagged in DB and locally', async () => {
                await article.save();                
                const success = await article.flag();                
                const dbRec = await Article.getbyId(article.article_id);
                
                expect(article.flagged).to.be.true;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.true;
            });
        });

        describe('after record is created in DB and unflag method is called', () => {            
            it('should be unflagged in DB and locally', async () => {
                await article.save();
                const success = await article.unflag();
                const dbRec = await Article.getbyId(article.article_id);
                expect(article.flagged).to.be.false;
                expect(success).to.be.true;
                expect(dbRec.flagged).to.be.false;
            });
        });
    });
  });

});
