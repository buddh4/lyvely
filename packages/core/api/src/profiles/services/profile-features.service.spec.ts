import { buildTest, LyvelyTestingModule } from '@/testing';
import { ProfileFeaturesService } from './index';
import { profilesTestPlugin, ProfileTestDataUtils } from '../testing';
import { clearFeatures, registerFeatures, UpdateFeatureModel } from '@lyvely/interface';
import { EntityNotFoundException, ForbiddenServiceException } from '@lyvely/common';

describe('ProfileFeaturesService', () => {
  let testingModule: LyvelyTestingModule;
  let profileFeaturesService: ProfileFeaturesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY).plugins([profilesTestPlugin]).compile();
    profileFeaturesService = testingModule.get<ProfileFeaturesService>(ProfileFeaturesService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    clearFeatures();
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(profileFeaturesService).toBeDefined();
  });

  describe('setFeatureState', () => {
    it('enable main feature works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true }),
      );

      expect(result.enabled).toEqual(['test']);
      expect(profile.enabledFeatures).toEqual(['test']);
    });

    it('enabling a feature removes disabled entry', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.disabledFeatures = ['test', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true }),
      );

      expect(result.disabled).toEqual(['another']);
      expect(profile.disabledFeatures).toEqual(['another']);
    });

    it('enable non installable does not works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: false,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      expect.assertions(1);
      try {
        await profileFeaturesService.setFeatureState(
          profile,
          new UpdateFeatureModel({ featureId: 'test', state: true }),
        );
      } catch (e) {
        expect(e instanceof ForbiddenServiceException).toEqual(true);
      }
    });

    it('enable sub feature works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          title: 'test.sub.title',
          dependencies: ['test'],
          installable: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test.sub', state: true }),
      );

      expect(result.enabled).toEqual(['test.sub', 'test']);
      expect(profile.enabledFeatures).toEqual(['test.sub', 'test']);
    });

    it('disable main feature works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false }),
      );

      expect(result.disabled).toEqual(['test']);
      expect(profile.disabledFeatures).toEqual(['test']);
    });

    it('disable a feature removes disabled entry', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.enabledFeatures = ['test', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false }),
      );

      expect(result.enabled).toEqual(['another']);
      expect(profile.enabledFeatures).toEqual(['another']);
    });

    it('disabling a feature disables sub features', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          title: 'test.sub.title',
          installable: true,
          dependencies: ['test'],
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.enabledFeatures = ['test', 'test.sub', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false }),
      );

      expect(result.disabled).toEqual(['test', 'test.sub']);
      expect(profile.disabledFeatures).toEqual(['test', 'test.sub']);

      expect(result.enabled).toEqual(['another']);
      expect(profile.enabledFeatures).toEqual(['another']);
    });

    it('enabling a feature enables sub features with enabledByDefault', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          title: 'test.sub.title',
          installable: true,
          enabledByDefault: true,
          dependencies: ['test'],
        },
        {
          id: 'test.sub2',
          moduleId: 'test',
          title: 'test.sub2.title',
          installable: true,
          enabledByDefault: false,
          dependencies: ['test'],
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.disabledFeatures = ['test', 'test.sub', 'test.sub2', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true }),
      );

      expect(result.disabled).toEqual(['test.sub2', 'another']);
      expect(profile.disabledFeatures).toEqual(['test.sub2', 'another']);

      expect(result.enabled).toEqual(['test', 'test.sub']);
      expect(profile.enabledFeatures).toEqual(['test', 'test.sub']);
    });

    it('enable non profile feature does not work', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          title: 'test.title',
          installable: true,
          global: true,
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      expect.assertions(1);
      try {
        await profileFeaturesService.setFeatureState(
          profile,
          new UpdateFeatureModel({ featureId: 'test', state: true }),
        );
      } catch (e) {
        expect(e instanceof EntityNotFoundException).toEqual(true);
      }
    });
  });
});
