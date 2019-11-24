
import { expect } from 'chai';
import User from '../../../../src/api/v1/models/user.model';

describe('User model', () => {
  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "userid"', () => {
        expect(User.pkfield()).to.be.equal('user_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "users"', () => {
        expect(User.viewTable()).to.be.equal('users');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "users"', () => {
        expect(User.modifyTable()).to.be.equal('users');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 8', () => {
        expect(User.modifyFields()).to.be.an('array').with.length(8);
      });
    });
    describe('when getbyIdwithPermissions is called', () => {
      it('should return user object permissions property', async () => {
        const userPerms = await User.getbyIdWithPermissions(1);
        expect(userPerms.permissions).to.be.an('array').with.length(2);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new user is created', () => {
      let user;
      before(() => {
        user = new User();
      });
      it('should have all specifed fields', () => {
        expect(user).to.haveOwnProperty('user_id');
        expect(user).to.haveOwnProperty('first_name');
        expect(user).to.haveOwnProperty('last_name');
        expect(user).to.haveOwnProperty('email');
        expect(user).to.haveOwnProperty('password');
        expect(user).to.haveOwnProperty('gender');
        expect(user).to.haveOwnProperty('department');
        expect(user).to.haveOwnProperty('job_role');
        expect(user).to.haveOwnProperty('address');
      });
    });
  });
});
