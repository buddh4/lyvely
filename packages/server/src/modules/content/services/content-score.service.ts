import { Profile, ProfileScoreService } from "../../profiles";
import { Inject, Injectable } from "@nestjs/common";
import { Content, ContentScore } from "../schemas";
import { ContentScoreDao } from "../daos";
import { assureObjectId, EntityIdentity } from "../../../core/db/db.utils";
import { UserAssignmentStrategy } from "@lyvely/common";
import { User } from "../../users";

@Injectable()
export class ContentScoreService extends ProfileScoreService<ContentScore> {
  @Inject()
  protected profileScoreDao: ContentScoreDao;

  // TODO: Implement deleteScoreByContent and overwriteScoreByContent (or upsert)

  /*
  This implementation would delete all score entries related to a content if strategy is shared, also it is missing the profile score update
  we should prefer a upsert mechanism for such cases...

  async deleteScoresByContent(profile: Profile, user: User, content: EntityIdentity<Content>, strategy: UserAssignmentStrategy): Promise<boolean> {
    const result = strategy === UserAssignmentStrategy.Shared
      ? await this.profileScoreDao.deleteMany({ cid: assureObjectId(content) })
      : await this.profileScoreDao.deleteMany({ cid: assureObjectId(content), uid: assureObjectId(user) });
    return result > 0;
  }
  */

  async findScoresByContent(profile: Profile, user: User, content: EntityIdentity<Content>, strategy: UserAssignmentStrategy): Promise<ContentScore[]> {
    return strategy === UserAssignmentStrategy.Shared
      ? await this.profileScoreDao.findAll({ cid: assureObjectId(content) })
      : await this.profileScoreDao.findAll({ cid: assureObjectId(content), uid: assureObjectId(user) });
  }
}
