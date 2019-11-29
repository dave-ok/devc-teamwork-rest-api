import { expect } from 'chai';
import Feed from '../../../../src/api/v1/models/feed.model';

describe('Feed model', () => {
  describe('Static methods', () => {
    describe('when viewtable is called', () => {
      it('should return "vw_feed"', () => {
        expect(Feed.viewTable()).to.be.equal('vw_feed');
      });
    });
  });
});
