import { Expose } from 'class-transformer';
import { BaseModel, hasIntersection } from '@lyvely/common';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { IStreamFilter } from '@/streams';
import { ContentModel } from '@/content';

@Expose()
export class ContentStreamFilter
  extends BaseModel<ContentStreamFilter>
  implements IStreamFilter<ContentModel>
{
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsString()
  @IsOptional()
  query?: string;

  @IsMongoId({ each: true })
  @IsOptional()
  tagIds?: Array<string>;

  toggleTag(id: string) {
    if (this.isActiveTag(id)) {
      this.removeTagId(id);
    } else {
      this.addTagId(id);
    }
  }

  isActiveTag(id: string) {
    return this.tagIds?.find((tid) => tid === id);
  }

  setTagIds(ids: string[]) {
    this.tagIds = ids;
  }

  addTagId(id: string) {
    if (!this.tagIds) {
      this.tagIds = [];
    }

    this.tagIds.push(id);
  }

  removeTagId(id: string) {
    if (!this.tagIds) return;
    const tagIndex = this.tagIds.findIndex((tid) => id === tid);
    if (tagIndex === -1) return;
    this.tagIds.splice(tagIndex, 1);
  }

  isEmpty() {
    return !this.tagIds?.length && !this.query?.length && !this.archived;
  }

  getQueryKeys() {
    return ['archived', 'query', 'tagIds'];
  }

  getQuery() {
    const query = {} as Record<string, any>;
    if (this.archived) query['archived'] = 'true';
    if (this.query?.length) query['query'] = this.query;
    if (this.tagIds?.length) query['tagIds'] = this.tagIds;
    return query;
  }

  apply(items: ContentModel[]): ContentModel[] {
    return items.filter((item) => this.test(item));
  }

  test(item: ContentModel): boolean {
    if (this.parentId && item.meta.parentId !== this.parentId) return false;
    if (this.tagIds && !hasIntersection(this.tagIds, item.tagIds)) return false;
    if (this.archived && !item.meta.archived) return false;
    if (!this.archived && item.meta.archived) return false;
    if (
      this.query?.length &&
      !(item.getText()?.indexOf(this.query) || item.getText()?.indexOf(this.query))
    ) {
      return false;
    }

    return true;
  }

  mergeQuery(query: Record<string, any>) {
    const result = { ...query } as Record<string, any>;
    const filterQuery = this.getQuery();
    this.getQueryKeys().forEach((key) => {
      if (!filterQuery[key]) {
        delete result[key];
      } else {
        result[key] = filterQuery[key];
      }
    });

    return result;
  }

  fromQuery(query: Record<string, any>) {
    if (query.archived) this.archived = true;
    if (query.query?.length) this.query = query.query;
    if (query.tagIds?.length)
      this.tagIds = Array.isArray(query.tagIds) ? query.tagIds : [query.tagIds];
  }

  reset() {
    delete this.tagIds;
    delete this.query;
    delete this.archived;
    // parent filter needs to be reset manually
  }
}
