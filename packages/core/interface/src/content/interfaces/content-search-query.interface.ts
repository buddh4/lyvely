export interface IContentSearchQuery {
  cids?: string[];
  tagIds?: string[];
  /**  @deprecated use tagIds instead */
  tagId?: string;
  archived?: boolean;
  query?: string;
  type?: string;
}
