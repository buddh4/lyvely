export interface IFeature {
  id: string;
  name: string; //translatable
  description?: string; // translatable
  moduleId: string;
  categories?: string[]; //translatable category id
  installable?: boolean; // default false
  enabledByDefault?: boolean;
  configurable?: boolean;
  type: FeatureType;
  dependencies?: string[];
}

export enum FeatureType {
  Global = 'global',
  Profile = 'profile',
}

export interface IGlobalFeature extends IFeature {
  type: FeatureType.Global;
}

export interface IProfileFeature extends IFeature {
  type: FeatureType.Profile;
}
