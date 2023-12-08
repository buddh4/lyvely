import { CaptchaChallenge } from '../models';
import { StrictEndpoint } from '@/endpoints';

export interface ICaptchaService {
  challenge(): Promise<CaptchaChallenge>;
  refresh(identity: string): void;
}

export const API_CAPTCHA = 'captcha';
export type CaptchaEndpoint = StrictEndpoint<ICaptchaService>;

export const CaptchaEndpoints = {
  REFRESH: 'refresh',
};
