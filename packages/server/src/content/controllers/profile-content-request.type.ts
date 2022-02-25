import { UserProfileRequest } from '../../core/types';
import { Content } from '../schemas';

export type ProfileContentRequest = UserProfileRequest & { content: Content };
