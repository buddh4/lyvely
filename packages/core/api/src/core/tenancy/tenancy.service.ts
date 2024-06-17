import { ConfigService } from '@nestjs/config';
import { TenancyIsolation } from './tenancy-isolation.enum';
import { type TObjectId } from '@/core/db/interfaces';
import { assureStringId } from '@/core/db/utils';
import type { ITenant } from './tenant.interface';
import { Injectable } from '@nestjs/common';

/**
 * Responsible for managing multi-tenancy functionality.
 */
@Injectable()
export class TenancyService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves the tenancy isolation configuration value.
   *
   * @return {TenancyIsolation} The configured tenancy isolation value.
   */
  getTenancyIsolation(): TenancyIsolation {
    return this.configService.get<TenancyIsolation>('tenancy.isolation', TenancyIsolation.None);
  }

  /**
   * Retrieves the list of tenants from the configuration service.
   *
   * @returns {ITenant[]} The list of tenants retrieved from the configuration service.
   */
  getTenants(): ITenant[] {
    return this.configService.get<ITenant[]>('tenancy.tenants', []);
  }

  /**
   * Retrieves the name of the tenancy database.
   *
   * @param {string} oid - The unique identifier of the tenancy.
   * @return {string} - The name of the tenancy database.
   */
  getTenancyDb(oid: string): string {
    const collectionPrefix = this.configService.get<string>('tenancy.collectionPrefix', 'lyvely-');
    return `${collectionPrefix}${oid}`;
  }

  /**
   * Checks if a tenant should be isolated.
   *
   * @param {string|TObjectId} oid - The identifier of the tenant.
   * @return {boolean} - True if the tenant is isolated, false otherwise.
   */
  isIsolatedTenant(oid: string | TObjectId): boolean {
    if (this.getTenancyIsolation() === TenancyIsolation.None) return false;
    if (this.getTenancyIsolation() === TenancyIsolation.Strict) return true;
    return !!this.getTenants().find((t) => t.oid === assureStringId(oid));
  }
}
