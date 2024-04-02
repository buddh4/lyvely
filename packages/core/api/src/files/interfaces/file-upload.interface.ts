import type { TObjectId } from '@/core';
import type { IFile } from './file.interface';

/**
 * Represents a file upload request. This interface contains all properties required to store and
 * persist a file.
 *
 * @template TFile - Type parameter representing the file details.
 */
export interface IFileUpload<TFile extends IFile<TObjectId> = IFile<TObjectId>> {
  /** User id who created the file. **/
  createdBy: TObjectId;

  /** oid, pid relation. **/
  context?: { oid: TObjectId; pid: TObjectId };

  /** Optional guid, if not provided the provider will assign a unique guid. **/
  guid: string;

  /**
   * The bucket this file will be saved in.
   * If the bucket does not already exist, it will be created.
   * Here some rules to follow:
   *  - 3 - 63 lowercase letters, numbers and hyphens.
   *  - Not be formatted as an IP address.
   *  - Begin and end with lower case letter or number
   */
  bucket: string;

  /**
   * Used to directly provide variants with the upload.
   */
  variants?: TFile['variants'];

  /**
   * Temporary file path.
   */
  filePath: string;

  /**
   * Original of the file
   *
   * @type {string}
   * @since 1.0.0
   */
  fileName: string;

  /**
   * Size of the file in bytes.
   */
  fileSize: number;

  /**
   * File mime type
   */
  mime: string;
}
