import { __decorate, __metadata } from "tslib";
import { mapType, registerMapping } from '../index';
import { BaseModel, PropertyType } from '@lyvely/common';
class User extends BaseModel {
}
class UserInfos extends BaseModel {
}
__decorate([
    PropertyType([User]),
    __metadata("design:type", Array)
], UserInfos.prototype, "userInfos", void 0);
describe('object mapping', () => {
    describe('mapType()', function () {
        it('simple object mapping', async () => {
            class UserInfo extends BaseModel {
            }
            registerMapping(User, UserInfo, (user) => new UserInfo({
                fullName: `${user.forename} ${user.lastname}`,
            }));
            const userInfo = mapType(User, UserInfo, { forename: 'Michael', lastname: 'Jackson' });
            expect(userInfo instanceof UserInfo).toEqual(true);
            expect(userInfo.fullName).toEqual('Michael Jackson');
        });
        it('array to single object mapping', async () => {
            registerMapping([User], UserInfos, (users) => new UserInfos({
                userInfos: users.map(({ forename, lastname }) => ({ forename, lastname })),
            }));
            const userInfo = mapType([User], UserInfos, [
                { forename: 'Michael', lastname: 'Jackson' },
                { forename: 'Jimmy', lastname: 'Hendrix' },
            ]);
            expect(userInfo.userInfos).toBeDefined();
            expect(userInfo.userInfos.length).toEqual(2);
            expect(userInfo.userInfos[0] instanceof User).toEqual(true);
            expect(userInfo.userInfos[1] instanceof User).toEqual(true);
        });
        it('empty array to single object mapping', async () => {
            registerMapping([User], UserInfos, (users) => new UserInfos({
                userInfos: users.map(({ forename, lastname }) => ({ forename, lastname })),
            }));
            const userInfo = mapType([User], UserInfos, []);
            expect(userInfo.userInfos).toBeDefined();
            expect(userInfo.userInfos.length).toEqual(0);
        });
        it('single to array object mapping', async () => {
            registerMapping(UserInfos, [User], (userInfo) => userInfo.userInfos.map((user) => new User(user)));
            const users = mapType(UserInfos, [User], new UserInfos({
                userInfos: [
                    { forename: 'Michael', lastname: 'Jackson' },
                    { forename: 'Jimmy', lastname: 'Hendrix' },
                ],
            }));
            expect(Array.isArray(users)).toEqual(true);
            expect(users.length).toEqual(2);
            expect(users[0] instanceof User).toEqual(true);
            expect(users[1] instanceof User).toEqual(true);
        });
        it('single with empty array to array object mapping', async () => {
            registerMapping(UserInfos, [User], (userInfo) => userInfo.userInfos.map((user) => new User(user)));
            const users = mapType(UserInfos, [User], new UserInfos({ userInfos: [] }));
            expect(Array.isArray(users)).toEqual(true);
            expect(users.length).toEqual(0);
        });
    });
});
