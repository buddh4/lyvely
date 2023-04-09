import { BaseModel, MilestoneRelationModel, CalendarDateTime, formatDate } from '@lyvely/common';
import { Content } from '@/content';

export interface IMilestoneRelationEventData {
  contents: Content[];
  date: CalendarDateTime;
}

export class MilestoneRelationEvent extends BaseModel<MilestoneRelationEvent> {
  static getKeyByContentType(contentType: string) {
    return `milestones.fetch.${contentType}`;
  }

  private result: MilestoneRelationModel[] = [];

  data: IMilestoneRelationEventData;

  constructor(data: IMilestoneRelationEventData) {
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
