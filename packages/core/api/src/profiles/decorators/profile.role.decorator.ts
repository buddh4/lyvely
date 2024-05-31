import { SetMetadata } from '@nestjs/common';
import { ProfileRelationRole } from '@lyvely/interface';
import { META_PROFILE_ROLE_LEVEL } from '../profiles.constants';

export const ProfileRole = (role: ProfileRelationRole) =>
  SetMetadata(META_PROFILE_ROLE_LEVEL, role);