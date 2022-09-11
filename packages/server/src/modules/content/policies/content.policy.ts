import { Policy } from '../../policies/interfaces/policy.interface';
import { Injectable } from '@nestjs/common';
import { ProfileContentContext } from '../guards';

@Injectable()
export abstract class ContentPolicy implements Policy<ProfileContentContext> {
  abstract validate(context: ProfileContentContext): Promise<boolean>;
}