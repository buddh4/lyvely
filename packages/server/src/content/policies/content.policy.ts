import { IPolicy } from '../../policies/interfaces/policy.interface';
import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from './profile-content-policy.context';

@Injectable()
export abstract class ContentPolicy implements IPolicy<ProfileContentContext> {
  abstract validate(context: ProfileContentContext): Promise<boolean>;
}