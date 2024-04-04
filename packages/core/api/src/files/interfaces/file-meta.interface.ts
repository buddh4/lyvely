/**
 * Represents the basic metadata of a file, other file types may extend this schema.
 */
export interface IFileMetadata {
  /** Original file name. **/
  name: string;

  /** File size in bytes. **/
  size: number;

  /** File mime type. **/
  mimeType: string;
}
