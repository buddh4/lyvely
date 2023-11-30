export interface IGlobalFeatureConfigDefinition {
  installable?: string[];
  nonInstallable?: string[];
  enabled?: string[];
  disabled?: string[];
}

export interface IFeatureConfigDefinition extends IGlobalFeatureConfigDefinition {
  installable?: string[];
  nonInstallable?: string[];
  enabled?: string[];
  disabled?: string[];
  fixed?: string[];
  suggested?: string[];
}

export type IFeatureUsageDefinition = { [k: string]: Pick<IFeatureConfigDefinition, 'suggested'> };

export type ISubscriptionDefinition = { [k: string]: IFeatureConfigDefinition };

export interface IFeatureConfig {
  global?: IGlobalFeatureConfigDefinition;
  profiles?: {
    default?: IFeatureConfigDefinition;
    usage?: IFeatureUsageDefinition;
    subscription?: ISubscriptionDefinition;
    group?: {
      default?: IFeatureConfigDefinition;
      usage?: IFeatureUsageDefinition;
      subscription?: ISubscriptionDefinition;
    };
    user?: {
      default?: IFeatureConfigDefinition;
      usage?: IFeatureUsageDefinition;
      subscription?: ISubscriptionDefinition;
    };
    organization?: {
      default?: IFeatureConfigDefinition;
      usage?: IFeatureUsageDefinition;
      subscription?: ISubscriptionDefinition;
      group?: {
        default?: IFeatureConfigDefinition;
        usage?: IFeatureUsageDefinition;
        subscription?: ISubscriptionDefinition;
      };
      user?: {
        default?: IFeatureConfigDefinition;
        usage?: IFeatureUsageDefinition;
        subscription?: ISubscriptionDefinition;
      };
    };
  };
}
