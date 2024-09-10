/**
 * Represents basic information about a content entry.
 *
 * @interface
 * @name IContentInfo
 *
 * @property {string} id - The unique identifier of the content.
 * @property {string} type - The type of the content.
 * @property {string} title - The title of the content.
 * @property {string=} text - The optional text associated with the content.
 */
export interface IContentInfo<TID = string> {
  id: string;
  type: string;
  title: string;
  text?: string;
  createdBy: TID;
}

/**
 * Represents the result of a content information retrieval operation.
 *
 * @interface
 */
export interface IContentInfoResult<TID = string> {
  infos: IContentInfo<TID>[];
}
