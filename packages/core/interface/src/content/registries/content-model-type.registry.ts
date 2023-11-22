import { Type } from '@lyvely/common';
import { ContentModel } from '../models';

const contentTypeRegistry = new Map<string, Type<ContentModel>>();

export function registerContentModelType(type: string, modelType: Type<ContentModel>) {
  contentTypeRegistry.set(type, modelType);
}

export function getContentModelType(type: string) {
  return contentTypeRegistry.get(type);
}
