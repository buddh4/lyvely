import { ProfileScoreService, ProtectedProfileContext } from '@/profiles';
import { Inject, Injectable } from '@nestjs/common';
import { Content, ContentScore } from '../schemas';
import { ContentScoreDao } from '../daos';
import { assureObjectId, DocumentIdentity } from '@/core';
import { UserAssignmentStrategy } from '@lyvely/interface';

@Injectable()
export class ContentScoreService extends ProfileScoreService<ContentScore> {
  @Inject()
  protected override profileScoreDao: ContentScoreDao;

  async findScoresByContent(
    context: ProtectedProfileContext,
    content: DocumentIdentity<Content>,
    strategy: UserAssignmentStrategy
  ): Promise<ContentScore[]> {
    const { user, profile } = context;
    return strategy === UserAssignmentStrategy.Shared
      ? await this.profileScoreDao.findAll({
          pid: assureObjectId(profile),
          cid: assureObjectId(content),
        })
      : await this.profileScoreDao.findAll({
          pid: assureObjectId(profile),
          cid: assureObjectId(content),
          uid: assureObjectId(user),
        });
  }
}
