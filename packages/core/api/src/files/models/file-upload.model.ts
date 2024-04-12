import { BaseModel, Optional, PropertyType, type StrictBaseModelData } from '@lyvely/common';
import { DEFAULT_REGION, type TObjectId, uniqueGuid } from '@/core';
import type { IFileInfo, IFileUpload } from '../interfaces';
import { File } from '../schemas';

/**
 * Represents a file upload request. This interface contains all properties required to store and
 * persist a file.
 *
 * @template File - Type parameter representing the file details.
 */
export class FileUpload<TFile extends File = File> implements IFileUpload<TFile> {
  /** User id who created the file. **/
  createdBy: TObjectId;

  /** oid, pid relation. **/
  context?: { oid: TObjectId; pid: TObjectId };

  /** Optional guid, if not provided the provider will assign a unique guid. **/
  @PropertyType(String, { default: uniqueGuid })
  guid: string;

  /**
   * The bucket this file will be saved in.
   * If the bucket does not already exist, it will be created.
   * Here some rules to follow:
   *  - 3 - 63 letters, numbers and hyphens.
   *  - Begin and end with lower case letter or number.
   */
  bucket: string;

  /**
   * Represents a geographical region.
   * @typedef {string} Region
   * @description A string representing a geographical region.
   */
  @PropertyType(String, { default: DEFAULT_REGION })
  region: string;

  /**
   * Used to directly provide variants with the upload.
   */
  variants?: TFile['variants'];

  /**
   * The uploaded file data.
   */
  file: IFileInfo;

  /**
   * Determines if disk files may be moved instead of copied, which would improve performance. This flag should only be set
   * if the file is not needed in the original upload directory after uploading e.g. for processing variants.
   * Default: false.
   */
  moveFile?: boolean;

  constructor(data: StrictBaseModelData<Optional<FileUpload, 'region' | 'guid'>>) {
    BaseModel.init(this, data);
  }
}
