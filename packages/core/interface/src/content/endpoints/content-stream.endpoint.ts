import { IStreamClient } from '@/streams';
import { Endpoint, profileApiPrefix } from '@/endpoints';
import { ContentModel, ContentRequestFilter } from '../models';

export interface IContentStreamClient extends IStreamClient<ContentModel, ContentRequestFilter> {}

export type ContentStreamEndpoint = Endpoint<IContentStreamClient>;

export const API_CONTENT_STREAM = profileApiPrefix('stream');
