import { IActivity, ActivityType } from '../interfaces';
import { ContentFilter, ContentFilterOptions } from '../../content';

export interface ActivityFilterOptions extends ContentFilterOptions {
  type?: ActivityType;
}

export class ActivityFilter extends ContentFilter<IActivity<string>> {
  type?: ActivityType;

  run(model: IActivity) {
    if(this.type && this.type !== model.type) {
      return false;
    }

    return super.run(model);
  }

  update(update: Partial<ActivityFilter>) {
    if(update?.type) {
      this.type = update.type;
    }

    super.update(update);
  }
}
