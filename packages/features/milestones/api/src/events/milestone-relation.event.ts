import { BaseModel } from '@lyvely/common';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { CalendarDateTime, formatDate } from '@lyvely/dates';
import { Content } from '@lyvely/core';
import { User } from '@lyvely/core';
import { Types } from 'mongoose';

export interface IMilestoneRelationEventData<TContent extends Content = Content> {
  contents: TContent[];
  date?: CalendarDateTime;
  user?: User;
}

export class MilestoneRelationEvent<
  TContent extends Content = Content,
> extends BaseModel<MilestoneRelationEvent> {
  static getKeyByContentType(contentType: string) {
    return `milestones.fetch.${contentType}`;
  }

  private result: MilestoneRelationModel<Types.ObjectId>[] = [];

  data: IMilestoneRelationEventData<TContent>;

  constructor(data: IMilestoneRelationEventData<TContent>) {
    super({ data });
  }

  afterInit() {
    if (!this.data.date) {
      this.data.date = formatDate(new Date());
    }
  }

  addResult(model: MilestoneRelationModel<Types.ObjectId>) {
    this.result.push(model);
  }

  setResult(model: MilestoneRelationModel<Types.ObjectId>[]) {
    this.result = model;
  }

  getResult() {
    return this.result;
  }
}
