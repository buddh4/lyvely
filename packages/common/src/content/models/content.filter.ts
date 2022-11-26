import { escapeRegExp } from 'lodash';
import { Filter, FilterConstructorOptions } from '@/models';
import { TagModel } from '@/tags';
import { IContent } from '../interfaces';

export interface IContentFilterOptions {
  tagId?: string;
  archived?: boolean;
  query?: string;
  type?: string;
  includeOnFilter?: boolean;
}

type TagProvider = () => TagModel[];

export class ContentFilter<
  TModel extends IContent<string> = IContent<string>,
  TOptions extends IContentFilterOptions = IContentFilterOptions,
> extends Filter<TModel, TOptions> {
  tagProvider?: () => TagModel[];

  constructor(options?: FilterConstructorOptions<TModel, TOptions> & { tagProvider?: TagProvider }) {
    const tagProvider = options?.tagProvider;
    delete options?.tagProvider;

    super(options);

    this.tagProvider = tagProvider;

    if (this.tagProvider) {
      this.additions.push((model: TModel, filter: ContentFilter<TModel, TOptions>) => {
        const includeOnlyOnFilterTags = filter
          .tagProvider()
          .filter((tag) => tag.includeOnFilter && model.tagIds.includes(tag.id));
        return !(filter.isEmpty() && includeOnlyOnFilterTags.length);
      });
    }
  }

  protected getDefaultOptions(): TOptions {
    return <any>{ archived: false };
  }

  protected checkModel(model: TModel) {
    if (this.options.type && this.options.type !== model.type) {
      return false;
    }

    if (this.options.tagId && !model.tagIds?.includes(this.options.tagId)) {
      return false;
    }

    if (
      this.options.query?.length &&
      !((model.content.title || '') + (model.content.text || '')).match(
        new RegExp(escapeRegExp(this.options.query), 'i'),
      )
    ) {
      return false;
    }

    return !!this.options.archived === !!model.meta.isArchived;
  }

  isEmpty() {
    return !this.options.tagId && !this.options.archived && !this.options.query?.length;
  }
}
