export interface IFeature {
  id: string;
  title: string; //translatable
  moduleId: string;
  categories?: string[]; //translatable category id
  description?: string; // translatable
  installable?: boolean; // default false
  enabledByDefault?: boolean;
  configurable?: boolean;
  global?: boolean; // default false which means it is a profile feature
  dependencies?: string[];
}
