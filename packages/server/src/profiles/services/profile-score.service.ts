import { Injectable } from '@nestjs/common';
import { ProfileScoreDao, ProfileDao } from '../daos';
import { Profile, ProfileScore } from '../schemas';
import { createBaseEntityInstance } from "../../db/base.entity";

@Injectable()
export class ProfileScoreService<E extends ProfileScore> {

  protected profileScoreDao: ProfileScoreDao<E>;

  constructor(protected profileDao: ProfileDao) {}

  /**
   * Persists the given UserProfileAction and updates the profile score accordingly.
   * @param profile
   * @param model
   */
  async saveScore<T extends E = E>(profile: Profile, model: T): Promise<T> {
    // Here we set the discriminator field manually since the profile score dao may not be aware of the used type
    model.type = model.constructor.name;
    const contentScore = await this.profileScoreDao.save(model);
    await this.updateProfileScore(profile, contentScore.score);
    return createBaseEntityInstance(model.constructor as any, contentScore);
  }

  // TODO: Implement deleteScore and overwriteScore

  protected async updateProfileScore(profile: Profile, score: number) {
    if(score !== 0) {
      const newProfileScore = Math.max(profile.score + score, 0);
      await this.profileDao.updateScore(profile, newProfileScore);
    }
  }
}
