import { clearFeatures, registerFeatures } from './feature.registry';
import { isEnabledGlobalFeature } from './features.helper';
import { FeatureType } from './interfaces';

describe('isEnabledProfileFeature', function () {
  afterEach(() => clearFeatures);

  it('global feature is enabled by default', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Global,
      },
    ]);

    expect(isEnabledGlobalFeature('test')).toEqual(true);
  });

  it('non global feature is not enabled globally', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Profile,
      },
    ]);

    expect(isEnabledGlobalFeature('test')).toEqual(false);
  });

  it('global feature is enabled by config', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: false,
        type: FeatureType.Global,
      },
    ]);

    expect(isEnabledGlobalFeature('test', { global: { enabled: ['test'] } })).toEqual(true);
  });

  it('global feature is disabled by config', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Global,
      },
    ]);

    expect(isEnabledGlobalFeature('test', { global: { disabled: ['test'] } })).toEqual(false);
  });

  it('global feature dependency is disabled', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Global,
      },
      {
        id: 'test.sub',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        dependencies: ['test'],
        type: FeatureType.Global,
      },
    ]);

    expect(
      isEnabledGlobalFeature('test.sub', {
        global: { enabled: ['test.sub'], disabled: ['test'] },
      })
    ).toEqual(false);
  });

  it('global feature dependency is enabled', () => {
    registerFeatures([
      {
        id: 'test',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        type: FeatureType.Global,
      },
      {
        id: 'test.sub',
        moduleId: 'test',
        name: 'test.feature',
        enabledByDefault: true,
        dependencies: ['test'],
        type: FeatureType.Global,
      },
    ]);

    expect(isEnabledGlobalFeature('test.sub')).toEqual(true);
  });
});
