import { IContent } from './content.interface';
import { escapeRegExp } from "lodash";

export interface ContentFilterOptions<Model extends IContent<string> = IContent<string>> {
  tagId?: string;
  archived?: boolean;
  query?: string;
  additions?: ((model: Model, filter: ContentFilter<Model>) => boolean)[];
}

export class ContentFilter<Model extends IContent<string> = IContent<string>> {
  tagId?: string;
  archived = false;
  query?: string;
  additions: ((model: Model, filter: ContentFilter<Model>) => boolean)[] = [];

  constructor(filter?: ContentFilterOptions<Model>) {
    if(filter) {
      this.update(filter);
    }
  }

  isEmpty() {
    return !this.tagId && !this.archived && !this.query?.length;
  }

  reset() {
    this.tagId = undefined;
    this.archived = false;
    this.query = undefined;
  }

  run(model: Model) {
    if(this.tagId && !model.tagIds?.includes(this.tagId)) {
      return false;
    }

    if(!this.runAdditions(model)) {
      return false;
    }

    if(this.query?.length && !(model.title + model.text).match(new RegExp(escapeRegExp(this.query), 'i'))) {
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
