import { getObjectId, ILyvelyTestingModule } from '@/testing';
import { buildProfileTest, ProfileContext, ProfileTestDataUtils, Tag } from '@/profiles';
import { mapType } from '@lyvely/common';
import { ProfileWithRelationsModel } from '@lyvely/interface';
import { omit } from 'lodash';
import { instanceToPlain } from 'class-transformer';

describe('Profile model mapping', () => {
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile-mapping';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).compile();
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('Profile with relations', () => {
    it('transformation should contain in valid tag model', async () => {
      const { context } = await testData.createUserAndProfile();
      const tag = new Tag({
        _id: getObjectId('newTag'),
        name: 'Health',
        description: 'Health Test Tag',
        includeOnFilter: true,
        color: '#068087',
        archived: true,
      });

      context.profile.tags = [tag];

      const result = instanceToPlain(
        mapType(ProfileContext, ProfileWithRelationsModel<any>, context),
      );

      expect(result.tags).toEqual([omit(tag, '_id', 'isNew')]);
    });
  });
});
