import type { IPermissionConfig } from './permissions.interface';
import type { IFeatureConfig } from '@/features';

export interface IPermissionManagerConfig extends IPermissionConfig {
  featureConfig: IFeatureConfig;
}
