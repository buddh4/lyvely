import { BaseModel, PropertyType, TransformObjectId } from '@lyvely/common';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

function compareSpans(a: TimeSpanModel, b: TimeSpanModel) {
  if (a.from < b.from) return -1;
  if (a.from > b.from) return 1;
  return 0;
}

@Expose()
export class TimeSpanModel extends BaseModel<TimeSpanModel> {
  @TransformObjectId()
  uid?: any;
  from: number;
  to?: number;

  constructor(uid?: any) {
    super();
    if (!this.from) {
      this.from = Date.now();
    }

    if (uid) {
      this.uid = uid;
    }
  }
}

@Expose()
export class TimerModel<TID = string> extends BaseModel<TimerModel<TID>> {
  @TransformObjectId()
  uid?: TID;

  @PropertyType([TimeSpanModel])
  @ValidateNested()
  spans: TimeSpanModel[];

  start(uid?: TID) {
    if (this.isStarted()) return;
    const span = new TimeSpanModel(uid);
    this.spans.push(span);
    return span;
  }

  stop() {
    const span = this.getLatestSpan();
    if (!span) return;
    span.to = Date.now();
  }

  overwrite(newValue: number, uid?: TID) {
    if (newValue === 0) {
      this.spans = [];
      return;
    }

    const currentValueWithoutOpenSpan = this.calculateTotalSpan(false);
    const latestSpan = this.getLatestSpan();
    if (newValue > currentValueWithoutOpenSpan) {
      const diff = newValue - currentValueWithoutOpenSpan;
      if (!this.isStarted()) {
        if (latestSpan) {
          latestSpan.to! += diff;
        } else {
          const newSpan = this.start(uid);
          // Todo: This could be a problem when editing old dataPoints without any time spans
          newSpan!.from = Date.now() - diff; // This could be a problem when editing old dataPoints without spans
          newSpan!.to = newSpan!.from + diff;
        }
      } else {
        latestSpan!.to = latestSpan!.from + diff;
      }
    } else {
      let currentValue = 0;
      const newSpans: TimeSpanModel[] = [];
      for (let i = 0; i < this.spans.length; i++) {
        const currSpan = this.spans[i];
        const timeSpan = this.calculateSpan(this.spans[i], false);
        if (currentValue + timeSpan >= newValue) {
          currSpan.to = currSpan.from + (newValue - currentValue);
          newSpans.push(currSpan);
          break;
        } else {
          newSpans.push(currSpan);
          currentValue += timeSpan;
        }
      }
      this.spans = newSpans;
    }
  }

  getLatestSpan() {
    if (!this.spans?.length) return;
    return this.spans.sort(compareSpans)[this.spans.length - 1];
  }

  isStarted() {
    const span = this.getLatestSpan();
    return !!span && !span.to;
  }

  calculateTotalSpan(includeOpenSpan = true) {
    return (
      this.spans?.reduce((val, curr) => val + this.calculateSpan(curr, includeOpenSpan), 0) ?? 0
    );
  }

  private calculateSpan(span: TimeSpanModel, includeOpenSpan = true) {
    if (span.to) {
      return span.to - span.from;
    } else if (includeOpenSpan) {
      return Date.now() - span.from;
    }

    return 0;
  }
}
