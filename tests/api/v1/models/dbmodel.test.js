
import {use, expect} from 'chai';
import db from '../../../../src/api/db';
import DBModel from './../../../../src/api/v1/models/dbmodel';

use(require('chai-as-promised'));

describe('DBModel model', () => {

  //create a table in DB for running tests
  before(async () => {
    let qry = 'create table test(pk serial, col1 character varying, col2 integer);';
    await db.query(qry);

    qry = 'insert into test(col1, col2) values($1, $2)';
    await db.query(qry, ['row1', 100]);
    await db.query(qry, ['row2', 200]);
    await db.query(qry, ['row3', 150]);
    await db.query(qry, ['row4', 100]);
  });
  
  describe('Static properties', () => {
    describe('when pkField is called', () => {
      it('should return "pk"', () => {
        expect(DBModel.pkfield()).to.be.equal('pk');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "test"', () => {
        expect(DBModel.viewTable()).to.be.equal('test');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "test"', () => {
        expect(DBModel.modifyTable()).to.be.equal('test');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return an array of length, 2', () => {
        expect(DBModel.modifyFields()).to.be.an('array').with.length(2);
      });
    });
    
  });
  
  describe('Static methods', () => {
    
    describe('Get by Id', () => {
      describe('with default columns', () => {
        it('should return an object with 3 properties and values', async () => {
          const row = await DBModel.getbyId(2);
          expect(row).to.have.property('pk', 2);
          expect(row).to.have.property('col1', 'row2');
          expect(row).to.have.property('col2', 200);
        });
      });
      describe('with specific columns', () => {
        it('should return an object with 2 properties and values', async () => {
          const row = await DBModel.getbyId(2, ['pk', 'col1']);
          expect(row).to.have.property('pk', 2);
          expect(row).to.have.property('col1', 'row2');
          expect(row).to.not.have.property('col2', 200);
        });
      });
    });
    describe('Get many records', () => {
      describe('with order by clause and where clause', () => {  
        it('should return 2 objects in specified order', async () => {
          const rows = await DBModel.getAll({col2: 100}, [], ['pk desc']);
          expect(rows.length).to.be.equals(2);
          expect(rows[0]).to.have.property('col1', 'row4');
          expect(rows[1]).to.have.property('pk', 1);          
        });
      });
      describe('with where clause and returnCols', () => {      
        it('should return 2 objects with two columns', async () => {
          const rows = await DBModel.getAll({col2: 100}, ['pk','col2'], []);
          expect(rows.length).to.be.equals(2);
          expect(rows[0]).to.have.property('col2', 100);
          expect(rows[1]).to.have.property('pk', 4);          
        });
      });
      describe('with returnCols and order by clause', () => {      
        it('should return 3 objects with two columns', async () => {
          const rows = await DBModel.getAll({}, ['pk','col2'], ['col2 desc']);
          expect(rows.length).to.be.equals(4);
          expect(rows[0]).to.have.property('col2', 200);
          expect(rows[3]).to.have.property('pk', 4);          
        });
      });
      describe('without any parameters', () => {      
        it('should return 3 objects with two columns', async () => {
          const rows = await DBModel.getAll();
          expect(rows.length).to.be.equals(4);
          expect(rows[2]).to.have.property('col2', 150);
          expect(rows[3]).to.have.property('pk', 4);          
        });
      });

    });   
    
  });

  describe('Instance methods', () => {
    describe('Given a new record (model instance)', () => {
      let model;
      
      before(() => {
        model = new DBModel();
        model.pk = -1;
        model.col1 = 'new row';
        model.col2 = 500;        
      });
      describe('when it is inserted', () => { 
        before(async () => {
          await model.save();
        });

        it('should have a pkfield value of 5', () => {          
          expect(model.pk).to.be.equals(5);                  
        });
        it('should exist in database', async () => {
          const row = await DBModel.getbyId(model.pk);         
          expect(row).to.have.property('pk', 5);        
        });
      });
    }); 
    describe('Update record', () => {
      describe('Given an existing record (model instance)', () => {
        let model;
        
        before(() => {
          model = new DBModel();
          model.pk = 3;
          model.col1 = 'updated row';
          model.col2 = 300;        
        });
        describe('when an existing record is updated', () => { 
          let row;
          let row2;          

          before(async () => {
            await model.save();
            row = await DBModel.getbyId(model.pk);
            row2 = await DBModel.getbyId(2);
          });
  
          it('db should have a pkfield value of 3', () => {          
            expect(row.pk).to.be.equals(3);                  
          });
          it('db should have a col1 value of "updated row"', () => {          
            expect(row.col1).to.be.equals('updated row');                  
          });
          it('db should have a col2 value of 300', () => {          
            expect(row.col2).to.be.equals(300);                  
          });
          it('other records should be unaffected', () => {
            expect(row2.col2).to.be.equals(200); 
          });
        });
      }); 

    });
    describe('Delete record', () => {
      let row, row2, rowCheck;
      
      describe('when an existing record is deleted', () => {
        before(async () => {
          row = await DBModel.getbyId(4);
          await row.deleteOne();
          
          row2 = await DBModel.getbyId(2);          
        });

        it('should no longer exist in db', async () => {          
          await expect(DBModel.getbyId(4)).to.be.eventually.rejected;                  
        });
        it('record should be empty', () => {          
          expect(row).to.be.empty;                  
        });      
        it('other records should be unaffected', () => {
          expect(row2.col2).to.be.equals(200); 
        });
      });

      

    });    
    
  });

  //drop table after running tests
  after(async () => {
    return db.query('drop table test;');
  })
});
