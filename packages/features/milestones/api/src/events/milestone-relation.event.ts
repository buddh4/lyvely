import { MilestoneRelationModel } from '@lyvely/milestones-interface';
import { CalendarDateTime, formatDate } from '@lyvely/dates';
import { Content, User, TObjectId } from '@lyvely/api';

export interface IMilestoneRelationEventData<TContent extends Content = Content> {
  contents: TContent[];
  date?: CalendarDateTime;
  user?: User | null;
}

export class MilestoneRelationEvent<TContent extends Content = Content> {
  private result: MilestoneRelationModel<TObjectId>[] = [];

  data: IMilestoneRelationEventData<TContent>;

  constructor(data: IMilestoneRelationEventData<TContent>) {
    this.data = data;
    if (!this.data.date) {
      this.data.date = formatDate(new Date());
    }
  }

  static getKeyByContentType(contentType: string) {
    return `milestones.fetch.${contentType}`;
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
