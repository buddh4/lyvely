import { ProfileController } from '@/profiles';
import { ContentTypeController } from '@/content';
import { ENDPOINT_JOURNALS } from '@lyvely/common';
import { UseClassSerializer } from '@/core';

@ContentTypeController(ENDPOINT_JOURNALS)
@UseClassSerializer()
export class JournalController {}
