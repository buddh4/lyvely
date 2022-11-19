import { BaseModel } from '@/models';
import { Exclude, Expose, Type } from 'class-transformer';
import { TransformObjectId } from '@/utils';

function compareSpans(a: TimeSpanModel, b: TimeSpanModel) {
  if (a.from < b.from) return -1;
  if (a.from > b.from) return 1;
  return 0;
}

@Exclude()
export class TimeSpanModel extends BaseModel<TimeSpanModel> {
  @Expose()
  @TransformObjectId()
  uid?: TObjectId;

  @Expose()
  from: number;

  @Expose()
  to?: number;
}

@Exclude()
export class TimerModel extends BaseModel<TimerModel> {
  @Expose()
  @TransformObjectId()
  uid?: TObjectId;

  @Expose()
  @Type(() => TimeSpanModel)
  spans: TimeSpanModel[];

  getLatestSpan() {
    if (!this.spans?.length) return;
    return this.spans.sort(compareSpans)[this.spans.length - 1];
  }

  isStarted() {
    const span = this.getLatestSpan();
    return span && !span.to;
  }

  calculateTotalSpan() {
    return (
      this.spans?.reduce((val, curr) => (curr.to ? val + (curr.to - curr.from) : val + (Date.now() - curr.from)), 0) ??
      0
    );
  }
}
