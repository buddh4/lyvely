import type { IDocumentTransformation, LeanDoc } from '@/core';
import { User } from '../users.schema';

export class LegacyLocaleTransformation implements IDocumentTransformation<User> {
  getId(): string {
    return LegacyLocaleTransformation.name;
  }
  condition(leanDoc: LeanDoc<User>): boolean {
    return leanDoc.locale?.toLocaleLowerCase() === 'de-de';
  }
  transform(leanDoc: LeanDoc<User>): LeanDoc<User> {
    leanDoc.locale = 'de';
    return leanDoc;
  }
}
