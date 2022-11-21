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

  calculateTotalSpan(includeOpenSpan = true) {
    return this.spans?.reduce((val, curr) => val + this.calculateSpan(curr, includeOpenSpan), 0) ?? 0;
  }

  calculateSpan(span: TimeSpanModel, includeOpenSpan = true) {
    if (span.to) {
      return span.to - span.from;
    } else if (includeOpenSpan) {
      return Date.now() - span.from;
    }

    return 0;
  }
}
