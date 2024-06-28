/**
 * Enum representing the level of tenancy isolation.
 */
export enum TenancyIsolation {
  /** No isolation enabled. **/
  None,
  /** Dynamic isolation of certain profiles. **/
  Profile,
  /** Strict isolation of almost all data. **/
  Strict,
}
