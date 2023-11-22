import { CaptchaChallenge } from '../models';
import { StrictEndpoint } from '@lyvely/common';

export interface ICaptchaService {
  challenge(): Promise<CaptchaChallenge>;
  refresh(identity: string): void;
}

export const ENDPOINT_CAPTCHA = 'captcha';
export type CaptchaEndpoint = StrictEndpoint<ICaptchaService>;

export const CaptchaEndpointPaths = {
  REFRESH: 'refresh',
};
