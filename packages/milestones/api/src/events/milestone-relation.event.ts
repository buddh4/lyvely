import { BaseModel, MilestoneRelationModel, CalendarDateTime, formatDate } from '@lyvely/common';
import { Content } from '@lyvely/content';
import { User } from '@lyvely/users';

export interface IMilestoneRelationEventData<TContent extends Content = Content> {
  contents: TContent[];
  date: CalendarDateTime;
  user: User;
}

export class MilestoneRelationEvent<
  TContent extends Content = Content,
> extends BaseModel<MilestoneRelationEvent> {
  static getKeyByContentType(contentType: string) {
    return `milestones.fetch.${contentType}`;
  }

  private result: MilestoneRelationModel[] = [];

  data: IMilestoneRelationEventData<TContent>;

  constructor(data: IMilestoneRelationEventData<TContent>) {
    super({ data });
  }

  afterInit() {
    if (!this.data.date) {
      this.data.date = formatDate(new Date());
    }
  }

  addResult(model: MilestoneRelationModel) {
    this.result.push(model);
  }

  setResult(model: MilestoneRelationModel[]) {
    this.result = model;
  }

  getResult() {
    return this.result;
  }
}
