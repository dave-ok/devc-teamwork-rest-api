import { expect } from 'chai';
import Tag from '../../../../src/api/v1/models/tag.model';

describe('Tag model', () => {
  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "tag_id"', () => {
        expect(Tag.pkfield()).to.be.equal('tag_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "tags"', () => {
        expect(Tag.viewTable()).to.be.equal('tags');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "tags"', () => {
        expect(Tag.modifyTable()).to.be.equal('tags');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 1', () => {
        expect(Tag.modifyFields()).to.be.an('array').with.length(1);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new tag is created', () => {
      let tag;
      beforeEach(() => {
        tag = new Tag();
        tag.tag = 'first tag';
      });
      it('should have all specifed fields', () => {
        expect(tag).to.haveOwnProperty('tag_id');
        expect(tag).to.haveOwnProperty('tag');
      });
    });
  });
});
