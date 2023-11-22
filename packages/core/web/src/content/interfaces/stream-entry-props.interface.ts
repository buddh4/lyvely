import { ContentModel } from '@lyvely/interface';
import { IStream } from '@/stream/stream.composable';

export interface IStreamEntryProps {
  model: ContentModel;
  stream?: IStream<ContentModel>;
  index?: number;
  bodyStyle?: 'none' | 'message' | 'block';
  omitTags?: boolean;
  merge?: boolean;
}
