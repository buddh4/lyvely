import { Injectable } from '@nestjs/common';
import { TestProfileScore, TestProfileScoreDocument } from './test-profile-score.schema';
import { ProfileScoreDao } from '../../daos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from '@lyvely/common';

@Injectable()
export class TestProfileActionDao extends ProfileScoreDao<TestProfileScore> {

  @InjectModel(TestProfileScore.name)
  model: Model<TestProfileScoreDocument>;

  getModelConstructor(): Constructor<TestProfileScore> {
    return TestProfileScore;
  }

  getModuleId(): string {
    return 'test';
  }
}
