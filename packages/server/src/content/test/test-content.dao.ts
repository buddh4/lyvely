import { ContentTypeDao } from '@/content';
import { TestContent } from './test-content.schema';
import { Constructor } from '@lyvely/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TestContentDao extends ContentTypeDao<TestContent> {
  @InjectModel(TestContent.name)
  protected model: Model<TestContent>;

  getModelConstructor(): Constructor<any> {
    return TestContent;
  }

  getModuleId(): string {
    return 'test';
  }
}
