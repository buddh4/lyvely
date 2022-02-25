import { Injectable } from '@nestjs/common';
import { AbstractUserProfileActionDao, ProfileDao } from '../daos';
import { Profile, ProfileAction } from '../schemas';

@Injectable()
export class AbstractUserProfileActionService<E extends ProfileAction> {

  protected userProfileActionDao: AbstractUserProfileActionDao<E>;

  constructor(protected profileDao: ProfileDao) {}

  /**
   * Persists the given UserProfileAction and updates the profile score accordingly.
   * @param profile
   * @param action
   */
  async createUserProfileAction(profile: Profile, action: E): Promise<E> {
    const model = await this.userProfileActionDao.create(action);

    if(model.score !== 0) {
      const newProfileScore = Math.max(profile.score + model.score, 0);
      await this.profileDao.updateScore(profile, newProfileScore);
      profile.score = newProfileScore;
    }

    return model;
  }
}
