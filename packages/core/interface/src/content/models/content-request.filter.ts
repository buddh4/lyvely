import { Expose } from 'class-transformer';
import { BaseModel, hasIntersection } from '@lyvely/common';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { IStreamFilter } from '@/streams';
import { ContentModel } from './content.model';

/**
 * Represents a filter for content streams.
 * @class
 *
 * @template T - The type of the content model.
 */
@Expose()
export class ContentRequestFilter
  extends BaseModel<ContentRequestFilter>
  implements IStreamFilter<ContentModel>
{
  /**
   * Filter by parent content id.
   *
   * @typedef {string} ParentId
   */
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  /**
   * Include or exclude archived entries.
   *
   * @type {boolean}
   */
  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  /**
   * Include or exclude deleted entries.
   *
   * @type {boolean}
   */
  @IsBoolean()
  @IsOptional()
  deleted?: boolean;

  /**
   * Full-text search.
   *
   * @type {string}
   */
  @IsString()
  @IsOptional()
  query?: string;

  /**
   * Tags to filter.
   *
   * @type {Array<string>}
   */
  @IsMongoId({ each: true })
  @IsOptional()
  tagIds?: Array<string>;

  /**
   * Toggles the specified tag.
   *
   * @param {string} id - The ID of the tag to toggle.
   * @return {void}
   */
  toggleTag(id: string) {
    if (this.isActiveTag(id)) {
      this.removeTagId(id);
    } else {
      this.addTagId(id);
    }
  }

  /**
   * Checks if the given tag id filter is active.
   *
   * @param {string} id - The id of the tag to check.
   * @return {boolean} - Returns true if the tag id filter is active, otherwise false.
   */
  isActiveTag(id: string) {
    return this.tagIds?.find((tid) => tid === id);
  }

  /**
   * Sets the tagIds filter with the specified array of strings.
   *
   * @param {string[]} ids - The array of strings representing the tag ids.
   */
  setTagIds(ids: string[]) {
    this.tagIds = ids;
  }

  /**
   * Adds a tag id filter to the tagIds array.
   *
   * @param {string} id - The tag id to add.
   */
  addTagId(id: string) {
    if (!this.tagIds) {
      this.tagIds = [];
    }

    this.tagIds.push(id);
  }

  /**
   * Removes a tag id filter from the tagIds array.
   *
   * @param {string} id - The ID of the tag to be removed.
   * @return {void}
   */
  removeTagId(id: string) {
    if (!this.tagIds) return;
    const tagIndex = this.tagIds.findIndex((tid) => id === tid);
    if (tagIndex === -1) return;
    this.tagIds.splice(tagIndex, 1);
  }

  /**
   * Checks if any filter is active.
   *
   * @returns {boolean} True if any filter is active, otherwise false.
   */
  isEmpty() {
    return !this.tagIds?.length && !this.query?.length && !this.archived;
  }

  /**
   * Returns the url query object used for filtering.
   *
   * @returns {Record<string, any>} The query object.
   */
  getQuery() {
    const query = {} as Record<string, any>;
    if (this.archived) query['archived'] = 'true';
    if (this.query?.length) query['query'] = this.query;
    if (this.tagIds?.length) query['tagIds'] = this.tagIds;
    return query;
  }

  /**
   * Filters the given items by applying active filters.
   *
   * @param {ContentModel[]} items - The array of items to apply the filter to.
   * @return {ContentModel[]} - The filtered array containing only the items that pass the filter.
   */
  apply(items: ContentModel[]): ContentModel[] {
    return items.filter((item) => this.test(item));
  }

  /**
   * Test method to check if an item satisfies the filter criteria.
   *
   * @param {ContentModel} item - The content item to be tested.
   * @return {boolean} - Returns `true` if the item satisfies the criteria, otherwise `false`.
   */
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

  /**
   * Merges the provided query with the filter query.
   *
   * @param {Record<string, any>} query - The query to merge with the filter query.
   *
   * @returns {Record<string, any>} - The merged query.
   *
   * @private
   */
  private mergeQuery(query: Record<string, any>) {
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

  /**
   * Retrieves the available query keys.
   *
   * @returns {string[]} An array containing the available query keys.
   */
  protected getQueryKeys() {
    return ['archived', 'query', 'tagIds'];
  }

  /**
   * Sets the active filters based on the provided query.
   *
   * @param {Record<string, any>} query - The query object containing filters to be activated.
   * @returns {void}
   */
  protected fromQuery(query: Record<string, any>) {
    if (query.archived) this.archived = true;
    if (query.query?.length) this.query = query.query;
    if (query.tagIds?.length)
      this.tagIds = Array.isArray(query.tagIds) ? query.tagIds : [query.tagIds];
  }

  /**
   * Resets the state of the method.
   *
   * This method deletes the `tagIds`, `query`, and `archived` properties of the current object.
   * It is important to note that the parent filter needs to be reset manually.
   *
   * @return {void}
   */
  reset() {
    delete this.tagIds;
    delete this.query;
    delete this.archived;
    // parent filter needs to be reset manually
  }
}
