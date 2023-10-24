import { Injectable } from '@nestjs/common';
import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreDao } from '../daos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@/core';
import { Constructor } from '@lyvely/common';

@Injectable()
export class TestProfileScoreDao extends ProfileScoreDao<TestProfileScore> {
  @InjectModel(TestProfileScore.name)
  model: Model<TestProfileScore>;

  getModelConstructor(): Constructor<TestProfileScore> {
    return TestProfileScore;
  }

  getModuleId(): string {
    return 'test';
  }
}
