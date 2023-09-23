import { IStreamService } from '@lyvely/streams';
import { ContentModel } from '@lyvely/content';
import { Endpoint } from '@lyvely/common';
import { ContentStreamFilter } from '../models';

export interface IContentStreamClient extends IStreamService<ContentModel, ContentStreamFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = 'stream';
