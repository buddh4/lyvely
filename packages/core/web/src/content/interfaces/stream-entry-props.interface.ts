import { ContentModel } from '@lyvely/core-interface';
import { IStream } from '@/stream/composables/stream.composable';

export interface IStreamEntryProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  index?: number;
  bodyStyle?: 'none' | 'message' | 'block';
  omitTags?: boolean;
  merge?: boolean;
}
