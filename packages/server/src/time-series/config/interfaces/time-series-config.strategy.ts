import { DataPointConfig, DataPointConfigRevision } from '@/time-series';

export interface TimeSeriesConfigStrategy<
  TConfig extends DataPointConfig = any,
  TRev extends DataPointConfigRevision = any,
> {
  //applyUpdate(user: User, config: TConfig, update: Partial<TConfig>);
  prepareUpdate(config: Partial<TConfig>): Partial<TConfig>;
  prepareConfig(config: TConfig);
  createRevision(config: TConfig): TRev;
}
