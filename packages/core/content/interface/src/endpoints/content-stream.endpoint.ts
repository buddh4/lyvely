import { IStreamService } from '@lyvely/streams-interface';
import { Endpoint } from '@lyvely/common';
import { ContentStreamFilter, ContentModel } from '../models';

export interface IContentStreamClient extends IStreamService<ContentModel, ContentStreamFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = 'stream';
