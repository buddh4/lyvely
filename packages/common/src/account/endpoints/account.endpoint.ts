import { StrictEndpoint } from '@/endpoints';
import { AddEmailDto, VerifyEmailDto } from '@/account/dtos';

export interface IAccountService {
  addEmail(dto: AddEmailDto);
  verifyEmail(dto: VerifyEmailDto);
}

export const ENDPOINT_ACCOUNT = 'account';
export type AccountEndpoint = StrictEndpoint<IAccountService>;
