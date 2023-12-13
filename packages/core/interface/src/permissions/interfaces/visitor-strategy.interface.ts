/**
 * Enum representing the visitor mode which defines how the platform handles unauthenticated visitors.
 * @enum {number}
 */
export enum VisitorMode {
  Disabled,
  Enabled,
}

/**
 * Represents a strategy for enabling visitors.
 * If visitor mode is enabled, at least one visitor accessible profile handle must be defined.
 * @typedef {Object} VisitorsEnabledStrategy
 * @property {string[]} handles - The handles for which visitors are enabled.
 */
export type VisitorsEnabledStrategy = {
  mode: VisitorMode.Enabled;
  handles: string[];
};

/**
 * Represents a strategy for disabling visitors.
 *
 * @typedef {Object} VisitorsDisabledStrategy
 * @property {VisitorMode.Disabled} mode - The mode indicating that visitors are disabled.
 * @property {undefined} handles - This property is not used and should be left undefined.
 */
export type VisitorsDisabledStrategy = {
  mode: VisitorMode.Disabled;
  handles?: undefined;
};

/**
 * Represents a visitor strategy that can be configured.
 * It can either enable or visitors access.
 */
export type VisitorStrategy = VisitorsEnabledStrategy | VisitorsDisabledStrategy;
