import { ProfileScoreDao } from '../daos';
import { Profile, ProfileScore } from '../schemas';
import { createBaseEntityInstance } from '@lyvely/core';
import { ProfilesService } from './profiles.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ProfileScoreService<E extends ProfileScore> {
  protected profileScoreDao: ProfileScoreDao<E>;

  constructor(protected profileService: ProfilesService) {}

  /**
   * Persists the given UserProfileAction and updates the profile score accordingly.
   * @param profile
   * @param model
   */
  async saveScore<T extends E = E>(profile: Profile, model: T): Promise<T> {
    // Here we set the discriminator field manually since the profile score dao may not be aware of the discriminator type
    model.type = model.constructor.name;
    const scoreModel = await this.profileScoreDao.save(model);
    await this.profileService.incrementScore(profile, scoreModel.score);
    return createBaseEntityInstance(model.constructor as any, scoreModel);
  }
}
