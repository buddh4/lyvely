/**
 * Represents the basic metadata of a file, other file types may extend this schema.
 */
export interface IFileMetadata {
  /** File size in bytes. **/
  size: number;

  /** File mime type. **/
  mime: string;

  /** Original file name. **/
  name: string;
}
