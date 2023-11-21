import { ProfileScoreDao } from '@/profiles';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@/core';
import { ContentScore } from '../schemas';
import { CONTENT_MODULE_ID } from '@lyvely/core-interface';

@Injectable()
export class ContentScoreDao extends ProfileScoreDao<ContentScore> {
  @InjectModel(ContentScore.name)
  protected model: Model<ContentScore>;

  getModelConstructor() {
    return ContentScore;
  }

  getModuleId(): string {
    return CONTENT_MODULE_ID;
  }
}
