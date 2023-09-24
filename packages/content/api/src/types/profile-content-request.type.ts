import { ProfileRequest } from '@lyvely/profiles';
import { Content } from '../schemas';

export type ProfileContentRequest<C extends Content = Content> = ProfileRequest & { content: C };
