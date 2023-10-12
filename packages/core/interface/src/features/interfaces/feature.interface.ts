export interface IFeature {
  id: string;
  category: string; //translatable category id
  title: string; //translatable
  description?: string; // translatable
  installable?: boolean; // default false
  activeByDefault?: boolean;
  global?: boolean; // default false which means it is a profile feature
  dependsOn?: string[];
}
