import { ContentModel } from '@lyvely/common';
import { IStream } from '@/modules/stream/composables/stream.composable';

export interface IStreamEntryProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  index?: number;
  bodyStyle?: 'none' | 'message' | 'block';
  omitTags?: boolean;
  merge?: boolean;
}
