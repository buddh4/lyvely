import { expect } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { UserDao } from '../daos/user.dao';
import { User, UserDocument, UserSchema } from '../schemas/users.schema';
import { Model } from 'mongoose';

describe('UserDao', () => {
  let testingModule: TestingModule;
  let userDao: UserDao;
  let userModel: Model<UserDocument>;

  const TEST_KEY = 'user_dao';

  beforeEach(async () => {
    testingModule = await Test.createTestingModule({
      imports: [
        TestDataUtils.getMongooseTestModule(TEST_KEY),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
        ]),
      ],
      providers: [UserDao],
    }).compile();

    userDao = testingModule.get<UserDao>(UserDao);
    userModel = testingModule.get<Model<UserDocument>>('UserModel');
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    expect(userDao).toBeDefined();
  });

  describe('insert()', () => {
    it('create user', async () => {
      const user = await userDao.create(new User({
        username: 'Test',
        email: 'test@test.de',
        locale: 'de',
        password: 'testPasswort'
      }));

      expect(user).toBeDefined();
      expect(user._id).toBeDefined();
      expect(user.id).toEqual(user._id.toString());
      expect(user.username).toEqual('Test');
      expect(user.email).toEqual('test@test.de');
      expect(user.locale).toEqual('de');
      expect(user.password).toBeDefined();
      // salted...
      expect(user.password).not.toEqual('testPasswort');
    });

    it('can not create user without password', async () => {
      try {
        await userDao.create(new User({
          username: 'Test',
          email: 'test@test.de',
          locale: 'de'
        }));
        expect(true).toEqual(false);
      } catch (e) {
        expect(e.errors).toBeDefined();
        expect(e.errors.password).toBeDefined();
        expect(e.errors.password.kind).toEqual('required');
      }
    });
  });
});
