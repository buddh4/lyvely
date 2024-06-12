import { ProfileModel, ProfileType, clearFeatures, registerFeatures, FeatureType } from '../../index';
import { isEnabledProfileFeature } from './profile-feature.helper';

describe('isEnabledProfileFeature', function () {
  afterEach(() => clearFeatures);

  it('test feature not registered', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const result = isEnabledProfileFeature('nonExistent', profile);
    expect(result).toEqual(false);
  });

  it('test global feature not enabled on profile', () => {
    const profile = new ProfileModel({ type: ProfileType.User });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Global
      },
    ]);

    const result = isEnabledProfileFeature('test', profile);
    expect(result).toEqual(false);
  });

  it('test enabled by default', () => {
    const profile = new ProfileModel({ type: ProfileType.User });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile);
    expect(result).toEqual(true);
  });

  it('test disabled by default', () => {
    const profile = new ProfileModel({ type: ProfileType.User });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: false,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile);
    expect(result).toEqual(false);
  });

  it('test feature dependency not enabled', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        type: FeatureType.Profile
      },
      {
        id: 'test.sub',
        moduleId: 'test',
        name: 'test.sub.feature',
        dependencies: ['test'],
        enabledByDefault: true,
        type: FeatureType.Profile
      },
    ]);
    const result = isEnabledProfileFeature('test.sub', profile, {
      profiles: { default: { enabled: ['test.sub'] } },
    });
    expect(result).toEqual(false);
  });

  it('test feature dependencies are enabled', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Profile
      },
      {
        id: 'test.sub',
        moduleId: 'test',
        name: 'test.sub.feature',
        dependencies: ['test'],
        enabledByDefault: true,
        type: FeatureType.Profile
      },
    ]);
    const result = isEnabledProfileFeature('test.sub', profile);
    expect(result).toEqual(true);
  });

  it('test explicitly disabled feature', () => {
    const profile = new ProfileModel({ type: ProfileType.User, enabledFeatures: ['test'] });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile, {
      profiles: { default: { disabled: ['test'], fixed: ['test'] } },
    });
    expect(result).toEqual(false);
  });

  it('test uninstalled on profile', () => {
    const profile = new ProfileModel({ type: ProfileType.User, disabledFeatures: ['test'] });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        installable: true,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile);
    expect(result).toEqual(false);
  });

  it('test installed on profile', () => {
    const profile = new ProfileModel({ type: ProfileType.User, enabledFeatures: ['test'] });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        installable: true,
        enabledByDefault: false,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile);
    expect(result).toEqual(true);
  });

  it('test not installable on profile by default', () => {
    const profile = new ProfileModel({ type: ProfileType.User, enabledFeatures: ['test'] });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        installable: false,
        enabledByDefault: false,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile, {
      profiles: { default: { nonInstallable: ['test'] } },
    });

    expect(result).toEqual(false);
  });

  it('test not installable on profile by config', () => {
    const profile = new ProfileModel({ type: ProfileType.User, enabledFeatures: ['test'] });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        installable: true,
        enabledByDefault: false,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile, {
      profiles: { default: { nonInstallable: ['test'] } },
    });

    expect(result).toEqual(false);
  });

  it('test disabled by config default profile', () => {
    const profile = new ProfileModel({ type: ProfileType.User });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile, {
      profiles: { default: { disabled: ['test'] } },
    });
    expect(result).toEqual(false);
  });

  it('test enabled by config default profile', () => {
    const profile = new ProfileModel({ type: ProfileType.User });

    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: false,
        type: FeatureType.Profile
      },
    ]);

    const result = isEnabledProfileFeature('test', profile, {
      profiles: { default: { enabled: ['test'] } },
    });
    expect(result).toEqual(true);
  });
});
