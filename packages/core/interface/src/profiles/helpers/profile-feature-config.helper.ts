import { ProfileType } from '../interfaces';
import { IFeatureConfig, IFeatureConfigDefinition } from '@/features/interfaces';
import { isEmpty } from 'lodash';

export interface IProfileFeatureInfo {
  subscription?: string;
  usage?: string[];
  disabledFeatures?: string[];
  enabledFeatures?: string[];
  type: string;
  oid: any;
  id: any;
  hasOrg?: boolean;
}

type IFindDefinition = (
  c: IFeatureConfig,
  p: IProfileFeatureInfo
) => IFeatureConfigDefinition | IFeatureConfigDefinition[] | undefined;
type IMergePipeEntry = {
  find: IFindDefinition;
  condition?: (p: IProfileFeatureInfo) => boolean;
  parent?: () => IMergePipeEntry;
};

// TODO: Here we should rather test against the subscription of the organization instead of the profile itself

const findOrganizationProfileTypeSubscription = (c: IFeatureConfig, p: IProfileFeatureInfo) =>
  (<any>c?.profiles?.[ProfileType.Organization])?.[p.type]?.subscription?.[p.subscription as any];

const findOrganizationProfileTypeUsage = (c: IFeatureConfig, p: IProfileFeatureInfo) => {
  const usage = (<any>c?.profiles?.[ProfileType.Organization])?.[p.type]?.usage;
  if (!usage || !p.usage?.length) return;
  return Object.getOwnPropertyNames(usage).reduce((result, featureUsage) => {
    if (p.usage?.includes(featureUsage)) result.push(usage[featureUsage]);
    return result;
  }, [] as IFeatureConfigDefinition[]);
};

const findProfileTypeUsage = (c: IFeatureConfig, p: IProfileFeatureInfo) => {
  const usage = (<any>c?.profiles)?.[p.type]?.usage;
  if (!usage || !p.usage?.length) return;
  return Object.getOwnPropertyNames(usage).reduce((result, featureUsage) => {
    if (p.usage?.includes(featureUsage)) result.push(usage[featureUsage]);
    return result;
  }, [] as IFeatureConfigDefinition[]);
};

const findProfileTypeSubscription = (c: IFeatureConfig, p: IProfileFeatureInfo) =>
  (<any>c?.profiles)?.[p.type]?.subscription?.[p.subscription as any];
const findSubscription = (c: IFeatureConfig, p: IProfileFeatureInfo) =>
  c?.profiles?.subscription?.[p.subscription as any];

const findUsage = (c: IFeatureConfig, p: IProfileFeatureInfo) => {
  const usage = c?.profiles?.usage;
  if (!usage || !p.usage?.length) return;
  return Object.getOwnPropertyNames(usage).reduce((result, featureUsage) => {
    if (p.usage?.includes(featureUsage)) result.push(usage[featureUsage]);
    return result;
  }, [] as IFeatureConfigDefinition[]);
};

const findOrganizationProfileType = (c: IFeatureConfig, p: IProfileFeatureInfo) =>
  (<any>c?.profiles?.[ProfileType.Organization])?.[p.type]?.default;
const findProfileTypeDefaults = (c: IFeatureConfig, p: IProfileFeatureInfo) =>
  (<any>c?.profiles)?.[p.type]?.default;
const findDefaults = (c: IFeatureConfig) => c?.profiles?.default;

const isOrganizationProfileType = (p: IProfileFeatureInfo) => !!p.hasOrg;

/*const test = {
  features: {
    profiles: {
      default: {
        installable: ['activities', 'activities.tasks', 'activities.habits', 'task', 'habits', 'milestones', 'tags'], // Restricts features which can be installed/enabled by profile admin
        nonInstallable: ['activities.milestones'] // Alternative to installable, can be used to exclude instead of including features
        enabled: ['activities', 'stream'], // Is enabled by default without manual installation, but can be disabled if suggested and deselected on profile installation and not fixed
        disabled: ['activities.milestones'], // Is disabled by default but can be enabled if
        fixed: ['activities.milestones', 'stream'], // Can not be disabled/enabled manually (Fixed enabled/disabled state)
        suggested: ['activities'] // Suggested while installing, note this requires the feature to be installable
      },
      subscription: { // can only be used to extend installable and enabled
        premium: { installable: ['*'] },
        business: { installable: ['^', 'kanban', 'calendar'] }
      },
      usage: { business: { suggested: ['activities.milestones'] } }, // only extends suggestions
      group: {},
      user: {},
      organization: {
        default: { installable:['*'], suggested: ['^' ,'calendar', ] }
        usage: { collaboration: { suggested: ['^', 'calendar'] } },
        group: {},
        user: {}
      }
    }
  }
}*/

const pipe: IMergePipeEntry[] = [
  { find: findDefaults },
  { find: findProfileTypeDefaults, parent: () => pipe[0] },
  { find: findUsage, parent: () => pipe[1], condition: (p) => !!p.usage },
  { find: findSubscription, parent: () => pipe[2] },
  { find: findProfileTypeUsage, parent: () => pipe[3], condition: (p) => !!p.usage },
  { find: findProfileTypeSubscription, parent: () => pipe[4], condition: (p) => !!p.subscription },
  {
    find: findOrganizationProfileType,
    parent: () => pipe[5],
    condition: isOrganizationProfileType,
  },
  {
    find: findOrganizationProfileTypeSubscription,
    parent: () => pipe[6],
    condition: (p: IProfileFeatureInfo) => !!p.subscription && isOrganizationProfileType(p),
  },
  {
    find: findOrganizationProfileTypeUsage,
    parent: () => pipe[7],
    condition: (p: IProfileFeatureInfo) => !!p.usage?.length && isOrganizationProfileType(p),
  },
];

export function mergeFeatureConfig(
  profile: IProfileFeatureInfo,
  config: IFeatureConfig | undefined
): IFeatureConfigDefinition {
  if (!config || isEmpty(config)) return {};

  for (const entry of [...pipe].reverse()) {
    const match = entry.find(config, profile);
    if (!match || (entry.condition && !entry.condition(profile))) continue;

    return mergeDefinition(profile, entry, config, match);
  }

  return {};
}

function mergeDefinition(
  profile: IProfileFeatureInfo,
  entry: IMergePipeEntry,
  config: IFeatureConfig,
  match: IFeatureConfigDefinition | IFeatureConfigDefinition[]
) {
  const result: Partial<IFeatureConfigDefinition> = {};
  ['installable', 'nonInstallable', 'enabled', 'disabled', 'fixed', 'suggested'].forEach((key) => {
    const merged = mergeProp(profile, config, entry, match, key as keyof IFeatureConfigDefinition);
    if (merged) result[key as keyof IFeatureConfigDefinition] = merged;
  });
  return result;
}

function mergeProp(
  profile: IProfileFeatureInfo,
  config: IFeatureConfig,
  entry: IMergePipeEntry,
  match: IFeatureConfigDefinition | IFeatureConfigDefinition[],
  prop: keyof IFeatureConfigDefinition
): string[] | undefined {
  let currentEntry: IMergePipeEntry | undefined = entry;
  let currentMatch: IFeatureConfigDefinition | IFeatureConfigDefinition[] | undefined = <
    IFeatureConfigDefinition
  >match;

  const resultSet = new Set<string>();
  let found = false;

  // Iterate up the feature definition tree
  while (currentEntry) {
    if (Array.isArray(currentMatch)) {
      currentMatch = {
        [prop]: Array.from(
          currentMatch.reduce((featureSet, config) => {
            config?.[prop]?.forEach((feat: string) => featureSet.add(feat));
            return featureSet;
          }, new Set<string>())
        ),
      } as IFeatureConfigDefinition;
    }

    // Get the feature definitions of the given prop and merge it with current result
    const features: Array<string> | undefined = currentMatch?.[prop];
    features?.forEach((feature) => {
      if (feature !== '^') resultSet.add(feature);
    });

    // Mark in case we found a feature definition
    if (features) {
      found = true;
    }

    // Only keep merging if there was no feature definition for this prop or if the definition contains ^
    if (features && !features.includes('^')) break;

    currentEntry = currentEntry.parent?.();
    currentMatch = currentEntry?.find(config, profile);
  }

  return found ? [...resultSet] : undefined;
}
