import { mergeFeatureConfig } from './profile-feature-config.helper';
import { ProfileModel, ProfileType } from '@/profiles';

describe('mergeFeatureConfig', function () {
  it('undefined config merge', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, undefined);
    expect(definition).toEqual({});
  });

  it('empty config merge', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, {});
    expect(definition).toEqual({});
  });

  it('default config match', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const defaultConfig = {
      installable: ['test'],
      nonInstallable: ['test2'],
      enabled: ['test'],
      disabled: ['test2'],
      suggested: ['test2'],
      fixed: ['test2'],
    };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: defaultConfig,
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('profile type defaults match', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const defaultConfig = {
      installable: ['test'],
    };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        UserProfile: { default: defaultConfig },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('merge defaults with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['test1'] },
        UserProfile: { default: { installable: ['^', 'test2'] } },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(true);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('not merge defaults with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['test1'] },
        UserProfile: { default: { installable: ['test2'] } },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(false);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('subscription match', () => {
    const profile = new ProfileModel({ type: ProfileType.User, subscription: 'prime' });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        subscription: { prime: defaultConfig },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('merge subscription with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User, subscription: 'prime' });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        UserProfile: { default: { installable: ['test1'] } },
        subscription: { prime: { installable: ['^', 'test2'] } },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(true);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('not merge subscription with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User, subscription: 'prime' });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        UserProfile: { default: { installable: ['test1'] } },
        subscription: { prime: { installable: ['test2'] } },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(false);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('organization profile type match', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      type: ProfileType.User,
    });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        Organization: {
          UserProfile: { default: defaultConfig },
        },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('merge organization profile type with subscription', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      type: ProfileType.User,
      subscription: 'prime',
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        subscription: { prime: { installable: ['test1'] } },
        Organization: {
          UserProfile: { default: { installable: ['^', 'test2'] } },
        },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(true);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('not merge organization profile type with subscription', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      type: ProfileType.User,
      subscription: 'prime',
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        subscription: { prime: { installable: ['test1'] } },
        Organization: {
          UserProfile: { default: { installable: ['test2'] } },
        },
      },
    });
    expect(definition.installable.includes('test1')).toEqual(false);
    expect(definition.installable.includes('test2')).toEqual(true);
  });

  it('organization profile type subscription match', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      type: ProfileType.User,
    });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        Organization: {
          UserProfile: {
            subscription: { prime: defaultConfig },
          },
        },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('merge all levels', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      type: ProfileType.User,
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['default'] },
        UserProfile: { default: { installable: ['^', 'userprofile'] } },
        subscription: { prime: { installable: ['^', 'subscription'] } },
        Organization: {
          UserProfile: {
            subscription: { prime: { installable: ['^', 'org_subscription'] } },
          },
        },
      },
    });

    expect(definition.installable.includes('org_subscription')).toEqual(true);
    expect(definition.installable.includes('subscription')).toEqual(true);
    expect(definition.installable.includes('userprofile')).toEqual(true);
    expect(definition.installable.includes('default')).toEqual(true);
  });

  it('merge usage all levels', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      type: ProfileType.User,
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        usage: { health: { suggested: ['default'] } },
        UserProfile: {
          usage: { health: { suggested: ['^', 'userprofile'] } },
        },
        subscription: { prime: { installable: ['^', 'subscription'] } },
        Organization: {
          UserProfile: {
            usage: { health: { suggested: ['^', 'org_profile_type'] } },
          },
        },
      },
    });

    expect(definition.suggested.includes('org_profile_type')).toEqual(true);
    expect(definition.suggested.includes('subscription')).toEqual(true);
    expect(definition.suggested.includes('userprofile')).toEqual(true);
    expect(definition.suggested.includes('default')).toEqual(true);
  });

  it('organization profile subscription match', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      type: ProfileType.Organization,
    });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        Organization: {
          subscription: { prime: defaultConfig },
        },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });
});
