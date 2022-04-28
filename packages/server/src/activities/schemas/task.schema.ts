import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '../../profiles';
import { AbstractCreateActivityDto, DataPointNumberInputStrategy, ITask as ITask } from 'lyvely-common';
import mongoose from 'mongoose';
import { User } from '../../users';
import { Activity } from './activity.schema';
import { DataPointConfigFactory } from '../../time-series';

export type TaskDocument = Task & mongoose.Document;

@Schema()
export class Task extends Activity implements ITask {

  @Prop()
  done: string;

  afterInit() {
    this.dataPointConfig = DataPointConfigFactory.createConfig(DataPointNumberInputStrategy.CheckboxNumber, {
      min: 1,
      max: 1,
      optimal: 1
    });
    super.afterInit();
  }

  public static create(owner: User, profile: Profile, data: AbstractCreateActivityDto): Task {
    data.strategy = DataPointNumberInputStrategy.CheckboxNumber;
    data.max = 1;
    data.optimal = 1;
    return Activity.createActivityType(owner, profile, data, Task);
  }
}

export const TaskSchema = SchemaFactory.createForClass(Task);
