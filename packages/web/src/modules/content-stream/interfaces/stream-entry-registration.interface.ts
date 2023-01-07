import { Component } from 'vue';
import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { ContentModel, Type } from '@lyvely/common';

export interface IContentTypeOptions {
  type: string;
  name: string | (() => string);
  feature: string;
  icon?: string;
  modelClass: Type<ContentModel>;
  streamEntryComponent: Component<IStreamEntryProps>;
  detailsComponent?: Component<IContentDetailsProps>;
}
