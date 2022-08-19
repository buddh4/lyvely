import { IContent } from '../../../index';

export class TestContent implements IContent {
  constructor(obj?: Partial<TestContent>) {
    Object.assign(this, obj);
  }

  id: string;
  type: string;
  text?: string;
  title?: string;
  archived: boolean;
  tagNames: string[];
  visibility: number;
  tagIds: string[];
}