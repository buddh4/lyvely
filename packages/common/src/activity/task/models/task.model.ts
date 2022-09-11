import { Exclude, Expose } from 'class-transformer';
import { ActivityType } from "../../models";
import { IsEnum } from 'class-validator';
import { ActivityModel } from "../../models";
import { ContentModel } from "../../../content";

@Exclude()
export class TaskModel extends ActivityModel<TaskModel> {
  @Expose()
  done?: string;

  @Expose()
  @IsEnum(ActivityType)
  type: string = ActivityType.Task;
}

@Exclude()
export class TaskWithUsersModel extends TaskModel {
  @Expose()
  doneBy?: UserDoneModel[];
}

@Expose()
export class UserDoneModel {
  uid: any;
  tid: string;
  date: Date;
}

export function isTask(content: ContentModel): content is TaskModel {
  return content.type === ActivityType.Task;
}


