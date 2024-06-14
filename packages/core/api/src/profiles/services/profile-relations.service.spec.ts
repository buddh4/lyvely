import { ILyvelyTestingModule } from '@/testing';
import { buildProfileTest, ProfileTestDataUtils } from '../testing';
import { ProfileRelationsService } from './profile-relations.service';

describe('ProfileRelationsService', () => {
  let testingModule: ILyvelyTestingModule;
  let relationsService: ProfileRelationsService;
  let testData: ProfileTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildProfileTest('ProfileMembershipService').compile();
    relationsService = testingModule.get(ProfileRelationsService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  it('should be defined', () => {
    expect(relationsService).toBeDefined();
  });

  describe('findProfileRelations', () => {
    it('find visitor relations', async () => {
      const { profile } = await testData.createSimpleGroup();

      const relations = await relationsService.findProfileRelations(profile);
      expect(relations.length).toEqual(2);
    });

    it('find group relations', async () => {
      const { profile } = await testData.createSimpleGroup();

      const relations = await relationsService.findProfileRelations(profile);
      expect(relations.length).toEqual(2);
    });
  });
});
