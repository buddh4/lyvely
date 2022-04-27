import { Injectable } from '@nestjs/common';
import { ProfileScoreActionDao, ProfileDao } from '../daos';
import { Profile, ProfileScoreAction } from '../schemas';

@Injectable()
export abstract class ProfileScoreActionService<E extends ProfileScoreAction> {

  protected profileScoreActionDao: ProfileScoreActionDao<E>;

  constructor(protected profileDao: ProfileDao) {}

  /**
   * Persists the given UserProfileAction and updates the profile score accordingly.
   * @param profile
   * @param action
   */
  async saveProfileScoreAction(profile: Profile, action: E): Promise<E> {
    const model = await this.profileScoreActionDao.save(action);

    if(model.score !== 0) {
      const newProfileScore = Math.max(profile.score + model.score, 0);
      await this.profileDao.updateScore(profile, newProfileScore);
      profile.score = newProfileScore;
    }

    return model;
  }
}
