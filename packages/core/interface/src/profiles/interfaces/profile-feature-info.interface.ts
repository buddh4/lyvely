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
