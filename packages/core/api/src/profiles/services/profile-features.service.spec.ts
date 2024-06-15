import { ILyvelyTestingModule } from '@/testing';
import { ProfileFeaturesService } from './index';
import { buildProfileTest, ProfileTestDataUtils } from '../testing';
import {
  clearFeatures,
  registerFeatures,
  UpdateFeatureModel,
  DocumentNotFoundException,
  ForbiddenServiceException,
} from '@lyvely/interface';
import { FeatureType } from "@lyvely/interface";

describe('ProfileFeaturesService', () => {
  let testingModule: ILyvelyTestingModule;
  let profileFeaturesService: ProfileFeaturesService;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'profile_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY).compile();
    profileFeaturesService = testingModule.get<ProfileFeaturesService>(ProfileFeaturesService);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    clearFeatures();
    return testingModule.afterEach();
  });

  describe('setFeatureState', () => {
    it('enable main feature works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true })
      );

      expect(result.enabled).toEqual(['test']);
      expect(profile.enabledFeatures).toEqual(['test']);
    });

    it('enabling a feature removes disabled entry', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.disabledFeatures = ['test', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true })
      );

      expect(result.disabled).toEqual(['another']);
      expect(profile.disabledFeatures).toEqual(['another']);
    });

    it('enable non installable does not works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: false,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      expect.assertions(1);
      try {
        await profileFeaturesService.setFeatureState(
          profile,
          new UpdateFeatureModel({ featureId: 'test', state: true })
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
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          name: 'test.sub.title',
          dependencies: ['test'],
          installable: true,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test.sub', state: true })
      );

      expect(result.enabled).toEqual(['test.sub', 'test']);
      expect(profile.enabledFeatures).toEqual(['test.sub', 'test']);
    });

    it('disable main feature works', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false })
      );

      expect(result.disabled).toEqual(['test']);
      expect(profile.disabledFeatures).toEqual(['test']);
    });

    it('disable a feature removes disabled entry', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.enabledFeatures = ['test', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false })
      );

      expect(result.enabled).toEqual(['another']);
      expect(profile.enabledFeatures).toEqual(['another']);
    });

    it('disabling a feature disables sub features', async () => {
      registerFeatures([
        {
          id: 'test',
          moduleId: 'test',
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          name: 'test.sub.title',
          installable: true,
          dependencies: ['test'],
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.enabledFeatures = ['test', 'test.sub', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: false })
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
          name: 'test.title',
          installable: true,
          type: FeatureType.Profile
        },
        {
          id: 'test.sub',
          moduleId: 'test',
          name: 'test.sub.title',
          installable: true,
          enabledByDefault: true,
          dependencies: ['test'],
          type: FeatureType.Profile
        },
        {
          id: 'test.sub2',
          moduleId: 'test',
          name: 'test.sub2.title',
          installable: true,
          enabledByDefault: false,
          dependencies: ['test'],
          type: FeatureType.Profile
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      profile.disabledFeatures = ['test', 'test.sub', 'test.sub2', 'another'];

      const result = await profileFeaturesService.setFeatureState(
        profile,
        new UpdateFeatureModel({ featureId: 'test', state: true })
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
          name: 'test.title',
          installable: true,
          type: FeatureType.Global
        },
      ]);

      const { profile } = await testData.createUserAndProfile();

      expect.assertions(1);
      try {
        await profileFeaturesService.setFeatureState(
          profile,
          new UpdateFeatureModel({ featureId: 'test', state: true })
        );
      } catch (e) {
        expect(e instanceof DocumentNotFoundException).toEqual(true);
      }
    });
  });
});
