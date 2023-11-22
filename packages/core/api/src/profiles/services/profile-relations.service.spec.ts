import { buildTest, LyvelyTestingModule } from '@/testing';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';
import { ProfileRelationRole, ProfileType, ProfileVisibilityLevel } from '@lyvely/interface';
import { ProfileRelationsService } from './profile-relations.service';

describe('ProfileRelationsService', () => {
  let testingModule: LyvelyTestingModule;
  let relationsService: ProfileRelationsService;
  let testData: ProfileTestDataUtils;

  beforeEach(async () => {
    testingModule = await buildTest('ProfileMembershipService')
      .plugins([profilesTestPlugin])
      .compile();
    relationsService = testingModule.get(ProfileRelationsService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(relationsService).toBeDefined();
  });

  describe('findProfileRelations', () => {
    it('find visitor relations', async () => {
      const { profile } = await testData.createSimpleGroup();

      const relations = await relationsService.findProfileRelations(profile, null);
      expect(relations.user).toEqual(null);
      expect(relations.userRelations[0].role).toEqual(ProfileRelationRole.Visitor);
      expect(relations.profileRelations.length).toEqual(2);
    });

    it('find group relations', async () => {
      const { owner, profile, member } = await testData.createSimpleGroup();

      const relations = await relationsService.findProfileRelations(profile, member);
      expect(relations.user?._id).toEqual(member._id);
      expect(relations.userRelations[0].role).toEqual(ProfileRelationRole.Member);
      expect(relations.profileRelations.length).toEqual(2);

      const ownerRelations = await relationsService.findProfileRelations(profile, owner);
      expect(ownerRelations.user?._id).toEqual(owner._id);
      expect(ownerRelations.userRelations[0].role).toEqual(ProfileRelationRole.Owner);
      expect(ownerRelations.profileRelations.length).toEqual(2);
    });

    it('find organization relations', async () => {
      const { owner, organization, member } = await testData.createSimpleOrganization();
      const subProfile = await testData.createSubProfile(member, organization, ProfileType.Group);

      const relations = await relationsService.findProfileRelations(subProfile, member);
      expect(relations.user?._id).toEqual(member._id);
      expect(relations.userRelations[0].role).toEqual(ProfileRelationRole.Owner);
      expect(relations.profileRelations.length).toEqual(1);
      expect(relations.userOrganizationRelations[0].role).toEqual(ProfileRelationRole.Member);

      const orgOwnerrelations = await relationsService.findProfileRelations(subProfile, owner);
      expect(orgOwnerrelations.user?._id).toEqual(owner._id);
      expect(orgOwnerrelations.userRelations.length).toEqual(0);
      expect(orgOwnerrelations.profileRelations.length).toEqual(1);
      expect(orgOwnerrelations.userOrganizationRelations[0].role).toEqual(
        ProfileRelationRole.Owner,
      );
    });
  });
});
