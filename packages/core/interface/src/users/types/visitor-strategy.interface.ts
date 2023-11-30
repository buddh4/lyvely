export enum VisitorMode {
  Disabled,
  Enabled,
}

export type VisitorsEnabledStrategy = {
  mode: VisitorMode.Enabled;
  handles: string[];
};

export type VisitorsDisabledStrategy = {
  mode: VisitorMode.Disabled;
  handles?: undefined;
};

export type VisitorStrategy = VisitorsEnabledStrategy | VisitorsDisabledStrategy;
