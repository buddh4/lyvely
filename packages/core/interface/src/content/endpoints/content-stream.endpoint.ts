import { IStreamService } from '@/streams';
import { Endpoint } from '@lyvely/common';
import { ContentModel, ContentStreamFilter } from '../models';

export interface IContentStreamClient extends IStreamService<ContentModel, ContentStreamFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = 'stream';
