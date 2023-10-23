import { BaseModel } from '@lyvely/common';
import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { CalendarDateTime, formatDate } from '@lyvely/dates';
import { Content, User, TObjectId } from '@lyvely/core';

export interface IMilestoneRelationEventData<TContent extends Content = Content> {
  contents: TContent[];
  date?: CalendarDateTime;
  user?: User | null;
}

export class MilestoneRelationEvent<
  TContent extends Content = Content,
> extends BaseModel<MilestoneRelationEvent> {
  static getKeyByContentType(contentType: string) {
    return `milestones.fetch.${contentType}`;
  }

  private result: MilestoneRelationModel<TObjectId>[] = [];

  data: IMilestoneRelationEventData<TContent>;

  constructor(data: IMilestoneRelationEventData<TContent>) {
    super({ data });
  }

  afterInit() {
    if (!this.data.date) {
      this.data.date = formatDate(new Date());
    }
  }

  addResult(model: MilestoneRelationModel<TObjectId>) {
    this.result.push(model);
  }

  setResult(model: MilestoneRelationModel<TObjectId>[]) {
    this.result = model;
  }

  getResult() {
    return this.result;
  }
}
