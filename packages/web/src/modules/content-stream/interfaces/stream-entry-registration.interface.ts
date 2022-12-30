import { Component } from 'vue';
import { IStreamEntryProps } from './stream-entry-props.interface';
import { IContentDetailsProps } from './content-details-props.interface';
import { ContentModel, Type } from '@lyvely/common';

export interface IStreamEntryRegistration {
  type: string;
  modelClass: Type<ContentModel>;
  service: IContentSer
  streamEntryComponent: Component<IStreamEntryProps>;
  contentDetailsComponent: Component<IContentDetailsProps>;
}
