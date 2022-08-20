import { IContent } from './content.interface';

export interface ContentFilterOptions {
  tagId?: string;
  archived?: boolean;
}

export class ContentFilter<Model extends IContent<string>> {
  tagId?: string;
  archived = false;

  constructor(filter?: ContentFilterOptions) {
    if(filter) {
      this.update(filter);
    }
  }

  run(model: Model) {
    if(this.tagId && !model.tagIds?.includes(this.tagId)) {
      return false;
    }

    return !!this.archived === !!model.archived;
  }

  update(update: ContentFilterOptions) {
    if(update?.tagId) {
      this.tagId = update.tagId;
    }

    if(update?.archived === true) {
      this.archived = update.archived;
    }
  }
}
