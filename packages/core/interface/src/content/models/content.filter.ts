import { escapeRegExp } from 'lodash';
import { Filter, FilterConstructorOptions, IFilter } from '@lyvely/common';
import { TagModel } from '@/profiles';
import { IContent } from '../interfaces';

export interface IContentFilterOptions {
  tagId?: string;
  archived?: boolean;
  query?: string;
  type?: string;
  includeOnFilter?: boolean;
}

type TagProvider = () => TagModel[];

export interface IContentFilter<
  TModel extends IContent<string> = IContent<string>,
  TOptions extends IContentFilterOptions = IContentFilterOptions,
> extends IFilter<TModel, TOptions> {
  setTagProvider(provider: TagProvider);
  tagProvider?: () => TagModel[];
}

export class ContentFilter<
  TModel extends IContent<string> = IContent<string>,
  TOptions extends IContentFilterOptions = IContentFilterOptions,
  TFilter extends IContentFilter<TModel, TOptions> = IContentFilter<TModel, TOptions>,
> extends Filter<TModel, TOptions, TFilter> {
  tagProvider?: () => TagModel[];

  constructor(
    options?: FilterConstructorOptions<TModel, TOptions> & { tagProvider?: TagProvider },
  ) {
    const tagProvider = options?.tagProvider;
    delete options?.tagProvider;

    super(options);

    if (tagProvider) {
      this.setTagProvider(tagProvider);
    }
  }

  setTagProvider(provider: TagProvider) {
    if (this.tagProvider) return;

    this.tagProvider = provider;
    const tagAddition = (model: TModel, filter: IContentFilter<TModel, TOptions>) => {
      const includeOnlyOnFilterTags = filter.tagProvider!().filter(
        (tag) => tag.includeOnFilter && model.tagIds.includes(tag.id),
      );
      return !(filter.isEmpty() && includeOnlyOnFilterTags.length);
    };
    this.additions.push(tagAddition);
  }

  protected getDefaultOptions(): TOptions {
    return <TOptions>{ archived: false };
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

    return !!this.options.archived === !!model.meta.archived;
  }

  isEmpty() {
    return !this.options.tagId && !this.options.archived && !this.options.query?.length;
  }
}
