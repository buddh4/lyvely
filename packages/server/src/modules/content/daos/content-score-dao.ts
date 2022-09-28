import { ProfileScoreDao } from '../../profiles';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContentScore, ContentActionDocument } from '../schemas';
import meta from '../content.meta';

@Injectable()
export class ContentScoreDao extends ProfileScoreDao<ContentScore> {
  @InjectModel(ContentScore.name)
  protected model: Model<ContentActionDocument>;

  getModelConstructor() {
    return ContentScore;
  }

  getModuleId(): string {
    return meta.id;
  }
}
