import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileScore } from '../schemas';
import { Model, AbstractDao, LeanDoc } from '@/core';
import { PROFILES_MODULE_ID } from '@lyvely/interface';
import type { Type } from '@lyvely/common';
import { ProfileScoreTypeRegistry } from '@/profiles/registires';

/**
 * Generic profile score dao.
 */
@Injectable()
export class ProfileScoreDao extends AbstractDao<ProfileScore> {
  @InjectModel(ProfileScore.name) protected model: Model<ProfileScore>;

  @Inject()
  protected profileScoreTypeRegistry: ProfileScoreTypeRegistry;

  override getModelConstructor(leanModel: LeanDoc<ProfileScore>): Type<ProfileScore> {
    return leanModel?.type && this.profileScoreTypeRegistry.isRegisteredType(leanModel.type)
      ? this.profileScoreTypeRegistry.getTypeConstructor(leanModel.type) || ProfileScore
      : ProfileScore;
  }

  override getModuleId(): string {
    return PROFILES_MODULE_ID;
  }
}
