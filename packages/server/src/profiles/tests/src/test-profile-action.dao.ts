import { Injectable } from '@nestjs/common';
import { TestProfileAction, TestScoreDocument } from './test-score.schema';
import { ProfileScoreActionDao } from '../../daos';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Constructor } from 'lyvely-common';

@Injectable()
export class TestProfileActionDao extends ProfileScoreActionDao<TestProfileAction> {

  @InjectModel(TestProfileAction.name)
  model: Model<TestScoreDocument>;

  getModelConstructor(): Constructor<TestProfileAction> {
    return TestProfileAction;
  }

  getModuleId(): string {
    return 'test';
  }
}
