import { ProfileContext } from '@/profiles/contexts';
import type { LyvelyStore } from '@/core';

export interface ProfileStore<TContext extends ProfileContext = ProfileContext>
  extends LyvelyStore<ProfileContext> {
  context: TContext;
}
