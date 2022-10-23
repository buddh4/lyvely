import { CaptchaChallenge } from '../models';
import { StrictEndpoint } from '@/endpoints';

export interface ICaptchaService {
  challenge(): Promise<CaptchaChallenge>;
  refresh(identity: string);
}

export const ENDPOINT_CAPTCHA = 'captcha';
export type CaptchaEndpoint = StrictEndpoint<ICaptchaService>;