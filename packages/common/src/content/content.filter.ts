import { IContent } from './content.interface';

export interface ContentFilterOptions<Model extends IContent<string> = IContent<string>> {
  tagId?: string;
  archived?: boolean;
  additions?: ((model: Model, filter: ContentFilter<Model>) => boolean)[];
}

export class ContentFilter<Model extends IContent<string> = IContent<string>> {
  tagId?: string;
  archived = false;
  additions: ((model: Model, filter: ContentFilter<Model>) => boolean)[] = [];

  constructor(filter?: ContentFilterOptions<Model>) {
    if(filter) {
      this.update(filter);
    }
  }

  isEmpty() {
    return !this.tagId && !this.archived;
  }

  run(model: Model) {
    if(this.tagId && !model.tagIds?.includes(this.tagId)) {
      return false;
    }

    debugger;

    if(!this.runAdditions(model)) {
      return false;
    }

    return !!this.archived === !!model.archived;
  }

  private runAdditions(model: Model) {
    let result = true;
    this.additions.forEach(addition => {
      if(!addition(model, this)) {
        result = false;
      }
    });
    return result;
  }

  update(update: ContentFilterOptions<Model>) {
    if(update?.tagId || update?.tagId === null) {
      this.tagId = update.tagId;
    }

    if(update?.archived !== undefined) {
      this.archived = update.archived;
    }

    if(update?.additions) {
      this.additions = update.additions;
    }
  }
}
