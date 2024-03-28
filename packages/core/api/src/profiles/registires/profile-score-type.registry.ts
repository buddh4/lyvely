import { Injectable, Logger } from '@nestjs/common';
import { ProfileScore } from '../schemas';
import { AbstractTypeRegistry } from '@/core';

@Injectable()
export class ProfileScoreTypeRegistry extends AbstractTypeRegistry<ProfileScore> {
  protected logger = new Logger(ProfileScoreTypeRegistry.name);
}
