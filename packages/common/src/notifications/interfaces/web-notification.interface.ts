import { UrlRoute } from '@/web';

export interface IWebNotification {
  id: string;
  type: string;
  route?: UrlRoute;
  source?: {
    guid: string;
    name: string;
  };
  title: string;
  body: string;
  seen: boolean;
}
