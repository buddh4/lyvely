import { IContent } from './content.interface';

export interface ContentFilterOptions {
  category?: string;
  archived?: boolean;
}

export class ContentFilter<Model extends IContent> {
  category?: string;
  archived = false;

  constructor(filter?: ContentFilterOptions) {
    if(filter) {
      this.update(filter);
    }
  }

  run(model: Model) {
    if(this.category && !model.categories?.includes(this.category)) {
      return false;
    }

    return !!this.archived === !!model.archived;
  }

  update(update: ContentFilterOptions) {
    if(update?.category) {
      this.category = update.category;
    }

    if(update?.archived === true) {
      this.archived = update.archived;
    }
  }
}
