import { Injectable } from '@nestjs/common';
import { TestProfileScore } from './test-profile-score.schema';
import { ProfileScoreTypeDao } from '../daos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@/core';
import { Type } from '@lyvely/common';

@Injectable()
export class TestProfileScoreTypeDao extends ProfileScoreTypeDao<TestProfileScore> {
  @InjectModel(TestProfileScore.name)
  model: Model<TestProfileScore>;

  getModelConstructor(): Type<TestProfileScore> {
    return TestProfileScore;
  }

  getModuleId(): string {
    return 'test';
  }
}
