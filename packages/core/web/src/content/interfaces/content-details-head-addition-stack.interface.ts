import { ContentModel } from '@lyvely/interface';
import type { IComponentStackEntrySpec } from '@lyvely/ui';

export interface IContentDetailsHeadAdditionStackSpec<
  TContentType extends ContentModel = ContentModel,
> extends IComponentStackEntrySpec<{
    props: {
      content: TContentType;
    };
  }> {}
