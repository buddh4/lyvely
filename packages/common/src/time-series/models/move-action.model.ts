import { Exclude, Expose } from "class-transformer";
import { CalendarIntervalEnum } from "@/calendar";

@Exclude()
export class MoveAction {
  @Expose()
  attachToId?: string;

  @Expose()
  interval: CalendarIntervalEnum


  constructor(obj?: Partial<MoveAction>) {
    if(obj) {
      this.attachToId = obj.attachToId;
      this.interval = obj.interval;
    }
  }
}
