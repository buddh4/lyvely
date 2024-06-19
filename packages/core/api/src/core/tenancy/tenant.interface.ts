import type { IFeatureConfig, IPermissionConfig } from '@lyvely/interface';
import type { I18NOptions } from '../interfaces/i18n-options.interface';

export interface ITenantConfig {
  features?: IFeatureConfig;
  permissions?: IPermissionConfig;
  i18n?: I18NOptions;
  modules?: Record<string, any>;
}

/**
 * Represents a tenant in the system.
 */
export interface ITenant {
  id: string;
  config?: ITenantConfig;
}
