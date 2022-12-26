import { IStreamService } from '@/stream';
import { ContentModel } from '@/content';
import { Endpoint } from '@/endpoints';
import { ContentStreamFilter } from '@/content-stream';

export interface IContentStreamClient extends IStreamService<ContentModel, ContentStreamFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = 'stream';
