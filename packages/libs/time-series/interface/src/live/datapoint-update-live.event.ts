import { ILiveProfileEvent } from '@lyvely/interface';

export class DatapointUpdateLiveEvent implements ILiveProfileEvent {
  name: string;
  module = 'time-series';
  pid: string;
  cid: string;
  tid: string;
  ts: number;
  value: unknown;
  valueType: string;

  constructor(
    type: string,
    options: Pick<DatapointUpdateLiveEvent, 'pid' | 'cid' | 'tid' | 'value' | 'valueType'>
  ) {
    this.name = buildDataPointUpdateEventName(type);
    this.pid = options.pid;
    this.cid = options.cid;
    this.tid = options.tid;
    this.value = options.value;
    this.ts = Date.now();
    this.valueType = options.valueType;
  }
}

export class PerUserDatapointUpdateLiveEvent extends DatapointUpdateLiveEvent {
  uid: string;

  constructor(
    uid: string,
    type: string,
    options: Pick<DatapointUpdateLiveEvent, 'pid' | 'cid' | 'tid' | 'value' | 'valueType'>
  ) {
    super(type, options);
    this.uid = uid;
  }
}

export function buildDataPointUpdateEventName(type: string) {
  return `${type.toLowerCase()}DataPointUpdate`;
}
