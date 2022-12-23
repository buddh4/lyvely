import { IStreamService } from '@/stream';
import { ContentModel } from '@/content';
import { Endpoint } from '@/endpoints';

export interface IContentStreamClient extends IStreamService<ContentModel> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = 'stream';
