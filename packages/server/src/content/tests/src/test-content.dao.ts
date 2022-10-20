import { AbstractContentDao } from '../../daos';
import { TestContent } from './test-content.schema';
import { Constructor } from '@lyvely/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TestContentDao extends AbstractContentDao<TestContent> {
  getModelConstructor(): Constructor<any> {
    return TestContent;
  }

  getModuleId(): string {
    return 'test';
  }
}
