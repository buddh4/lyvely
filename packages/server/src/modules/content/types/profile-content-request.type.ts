import { ProfileRequest } from '../../profiles';
import { Content } from '../schemas';

export type ProfileContentRequest<C extends Content = Content> = ProfileRequest & { content: C };
