import { ConfigService } from '@nestjs/config';
import { TenancyIsolation } from './tenancy-isolation.enum';
import { type TObjectId } from '@/core/db/interfaces';
import { assureStringId } from '@/core/db/utils';
import type { ITenant } from './tenant.interface';
import { Injectable } from '@nestjs/common';
import type { TenancyStore } from '@/core/tenancy/tenancy.store';
import { ClsService } from 'nestjs-cls';
import { CLS_TENANCY_ID } from './tenancy.constants';

/**
 * Responsible for managing multi-tenancy functionality.
 */
@Injectable()
export class TenancyService {
  constructor(
    private readonly configService: ConfigService,
    private readonly clsService: ClsService<TenancyStore>
  ) {}

  /**
   * Tries to retrieve the tenancy ID from context.
   * @private
   * @returns {string | undefined} The tenancy ID if available, otherwise undefined.
   */
  getTenancyId(): string | undefined {
    return assureStringId(this.clsService.get(CLS_TENANCY_ID), true);
  }

  /**
   * Retrieves the tenant object identified by the given tenant ID or the current tenancy ID.
   *
   * @param {string} [oid] - The tenant ID. If not provided, the current tenancy ID will be used.
   * @returns {ITenant | null} The tenant object if found, otherwise null.
   */
  getTenant(oid?: string): ITenant | null {
    const tenancyId = oid || this.getTenancyId();
    if (!tenancyId) return null;
    return this.getTenants().find((t) => t.id === tenancyId) || null;
  }

  /**
   * Retrieves the tenancy isolation configuration value.
   *
   * @return {TenancyIsolation} The configured tenancy isolation value.
   */
  getIsolationLevel(): TenancyIsolation {
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
    if (this.getIsolationLevel() === TenancyIsolation.None) return false;
    if (this.getIsolationLevel() === TenancyIsolation.Strict) return true;
    return !!this.getTenants().find((t) => t.id === assureStringId(oid));
  }
}
