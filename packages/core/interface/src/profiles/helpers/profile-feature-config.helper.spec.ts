import { mergeFeatureConfig } from './profile-feature-config.helper';
import { ProfileModel, ProfileType } from '../../index';

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
        user: { default: defaultConfig },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });

  it('merge defaults with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['test1'] },
        user: { default: { installable: ['^', 'test2'] } },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(true);
    expect(definition.installable!.includes('test2')).toEqual(true);
  });

  it('not merge defaults with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['test1'] },
        user: { default: { installable: ['test2'] } },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(false);
    expect(definition.installable!.includes('test2')).toEqual(true);
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
        user: { default: { installable: ['test1'] } },
        subscription: { prime: { installable: ['^', 'test2'] } },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(true);
    expect(definition.installable!.includes('test2')).toEqual(true);
  });

  it('not merge subscription with profile type defaults', () => {
    const profile = new ProfileModel({ type: ProfileType.User, subscription: 'prime' });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        user: { default: { installable: ['test1'] } },
        subscription: { prime: { installable: ['test2'] } },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(false);
    expect(definition.installable!.includes('test2')).toEqual(true);
  });

  it('organization profile type match', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      hasOrg: true,
      type: ProfileType.User,
    });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        organization: {
          user: { default: defaultConfig },
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
      hasOrg: true,
      subscription: 'prime',
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        subscription: { prime: { installable: ['test1'] } },
        organization: {
          user: { default: { installable: ['^', 'test2'] } },
        },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(true);
    expect(definition.installable!.includes('test2')).toEqual(true);
  });

  it('not merge organization profile type with subscription', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      type: ProfileType.User,
      hasOrg: true,
      subscription: 'prime',
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        subscription: { prime: { installable: ['test1'] } },
        organization: {
          user: { default: { installable: ['test2'] } },
        },
      },
    });
    expect(definition.installable!.includes('test1')).toEqual(false);
    expect(definition.installable!.includes('test2')).toEqual(true);
  });

  it('organization profile type subscription match', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      hasOrg: true,
      type: ProfileType.User,
    });
    const defaultConfig = { installable: ['test'] };
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        organization: {
          user: {
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
      hasOrg: true,
      type: ProfileType.User,
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        default: { installable: ['default'] },
        user: { default: { installable: ['^', 'userprofile'] } },
        subscription: { prime: { installable: ['^', 'subscription'] } },
        organization: {
          user: {
            subscription: { prime: { installable: ['^', 'org_subscription'] } },
          },
        },
      },
    });

    expect(definition.installable!.includes('org_subscription')).toEqual(true);
    expect(definition.installable!.includes('subscription')).toEqual(true);
    expect(definition.installable!.includes('userprofile')).toEqual(true);
    expect(definition.installable!.includes('default')).toEqual(true);
  });

  it('merge multiple usage suggestions', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      usage: [<any>'health', <any>'sport'],
      hasOrg: true,
      type: ProfileType.User,
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        usage: {
          health: { suggested: ['f1'] },
          sport: { suggested: ['f2'] },
        },
      },
    });

    expect(definition.suggested!.includes('f1')).toEqual(true);
    expect(definition.suggested!.includes('f2')).toEqual(true);
  });

  it('merge usage all levels', () => {
    const profile = new ProfileModel({
      oid: 'xy',
      id: 'xx',
      subscription: 'prime',
      usage: [<any>'health'],
      hasOrg: true,
      type: ProfileType.User,
    });
    const definition = mergeFeatureConfig(profile, {
      profiles: {
        usage: { health: { suggested: ['default'] } },
        user: {
          usage: { health: { suggested: ['^', 'userprofile'] } },
        },
        subscription: { prime: { suggested: ['^', 'subscription'] } },
        organization: {
          user: {
            usage: { health: { suggested: ['^', 'org_profile_type'] } },
          },
        },
      },
    });

    expect(definition.suggested!.includes('org_profile_type')).toEqual(true);
    expect(definition.suggested!.includes('subscription')).toEqual(true);
    expect(definition.suggested!.includes('userprofile')).toEqual(true);
    expect(definition.suggested!.includes('default')).toEqual(true);
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
        organization: {
          subscription: { prime: defaultConfig },
        },
      },
    });
    expect(definition).toEqual(defaultConfig);
  });
});
