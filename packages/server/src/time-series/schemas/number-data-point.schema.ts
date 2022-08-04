import { Prop } from '@nestjs/mongoose';
import { DataPoint } from "./data-point.schema";
import { assureStringId } from "../../db/db.utils";
import { NumberDataPointDto } from "lyvely-common";

export abstract class NumberDataPoint extends DataPoint<NumberDataPoint> {
  @Prop( { type: Number, required: true, default: 0 })
  value: number;

  afterInit() {
    this.value = this.value ?? 0;
    super.afterInit();
  }

  createDto(): NumberDataPointDto {
    return new NumberDataPointDto({
      id: this.id,
      cid: assureStringId(this.cid),
      uid: assureStringId(this.uid),
      interval: this.interval,
      date: this.date,
      tid: this.tid,
      value: this.value
    });
  }
}



