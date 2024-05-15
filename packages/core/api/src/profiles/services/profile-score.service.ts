import { ProfileScoreTypeDao } from '../daos';
import { ProfileScore } from '../schemas';
import { createBaseDocumentInstance } from '@/core';
import { ProfilesService } from './profiles.service';
import { Injectable } from '@nestjs/common';
import { Type } from '@lyvely/common';
import { ProfileContext } from '@/profiles';

@Injectable()
export abstract class ProfileScoreService<E extends ProfileScore> {
  protected profileScoreDao: ProfileScoreTypeDao<E>;

  constructor(protected profileService: ProfilesService) {}

  /**
   * Persists the given UserProfileAction and updates the profile score accordingly.
   * @param profile
   * @param model
   */
  async saveScore<T extends E = E>(context: ProfileContext, model: T): Promise<T> {
    // Here we set the discriminator field manually since the profile score dao may not be aware of the discriminator type
    model.type = model.constructor.name;
    const scoreModel = await this.profileScoreDao.save(model);
    await this.profileService.incrementScore(context.profile, scoreModel.score);
    return createBaseDocumentInstance(model.constructor as Type<T>, scoreModel);
  }
}
