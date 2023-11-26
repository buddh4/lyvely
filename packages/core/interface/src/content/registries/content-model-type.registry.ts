import { Type } from '@lyvely/common';
import { ContentModel } from '../models';

const contentTypeRegistry = new Map<string, Type<ContentModel>>();

interface SubType {
  value: Type<ContentModel>;
  name: string;
}

/**
 * This is a workaround for https://github.com/typestack/class-transformer/issues/1651
 */
const subTypes: SubType[] = [];

export function registerContentModelType(type: string, modelType: Type<ContentModel>) {
  subTypes.push({ value: modelType, name: type });
  contentTypeRegistry.set(type, modelType);
}

export function getContentModelType(type: string) {
  return contentTypeRegistry.get(type);
}

export function getSubTypes(): SubType[] {
  return subTypes;
}
