
import { expect } from 'chai';
import UserRole from '../../../../src/api/v1/models/userrole.model';

describe('UserRole model', () => {  

  describe('Static methods', () => {
    describe('when pkField is called', () => {
      it('should return "user_role_id"', () => {
        expect(UserRole.pkfield()).to.be.equal('user_role_id');
      });
    });
    describe('when viewtable is called', () => {
      it('should return "vw_user_roles"', () => {
        expect(UserRole.viewTable()).to.be.equal('vw_user_roles');
      });
    });
    describe('when modifyTable is called', () => {
      it('should return "user_roles"', () => {
        expect(UserRole.modifyTable()).to.be.equal('user_roles');
      });
    });
    describe('when modifyFields is called', () => {
      it('should return array of length 2', () => {
        expect(UserRole.modifyFields()).to.be.an('array').with.length(2);
      });
    });
    describe('when getbyUserId is called', () => {
      it('should return array of length 1', async () => {
        const userRoles = await UserRole.getbyUserId(1);
        expect(userRoles).to.be.an('array').with.length(2);
      });
    });
  });

  describe('Instance methods', () => {
    describe('when new user_role is created', () => {
        let user_role;
        before(() => {
            user_role = new UserRole();
        });
        it('should have all specifed fields', () => {
            expect(user_role).to.haveOwnProperty('user_role_id');
            expect(user_role).to.haveOwnProperty('user_id');
            expect(user_role).to.haveOwnProperty('role_id');
        })
    });
  });
});
