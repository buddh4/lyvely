import { Ref } from 'vue';

export type IStreamHistoryState = {
  models: Ref<ContentModel[]>;
  filter: Ref<ContentStreamFilter>;
  state: Ref<StreamState>;
};

export type IStreamHistoryState = {
  cid?: string;
};

export type IContentStreamHistory = {
  stream: IContentStreamState;
  state: IStreamHistoryState;
};
