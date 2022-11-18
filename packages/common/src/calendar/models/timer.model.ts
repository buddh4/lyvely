import { BaseModel } from '@/models';

export interface ITimeSpan {
  uid?: TObjectId;
  from: number;
  to?: number;
}

function compareSpans(a: ITimeSpan, b: ITimeSpan) {
  if (a.from < b.from) return -1;
  if (a.from > b.from) return 1;
  return 0;
}

export class TimerModel extends BaseModel<TimerModel> {
  uid?: TObjectId;
  spans: ITimeSpan[];

  getLatestSpan() {
    if (!this.spans?.length) return;
    return this.spans.sort(compareSpans)[this.spans.length - 1];
  }

  isStarted() {
    const span = this.getLatestSpan();
    return span && !span.to;
  }

  calculateTotalSpan() {
    return this.spans?.reduce((val, curr) => (curr.to ? val + (curr.to - curr.from) : val), 0) || 0;
  }
}
