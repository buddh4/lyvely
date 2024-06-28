import { ContentTypeDao } from '../daos';
import { TestContent } from './test-content.schema';
import { Dao } from '@/core';

@Dao(TestContent)
export class TestContentDao extends ContentTypeDao<TestContent> {}
