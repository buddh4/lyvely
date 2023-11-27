import { IStreamClient } from '@/streams';
import { Endpoint, profileApiPrefix } from '@/endpoints';
import { ContentModel, ContentStreamFilter } from '../models';

export interface IContentStreamClient extends IStreamClient<ContentModel, ContentStreamFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const ENDPOINT_CONTENT_STREAM = profileApiPrefix('stream');
