import type { TenancyIsolation } from '@/core/tenancy/tenancy-isolation.enum';
import type { ITenant } from '@/core/tenancy/tenant.interface';

export interface ITenancyOptions {
  isolation: TenancyIsolation;
  tenants?: ITenant[];
  collectionPrefix?: string;
}
