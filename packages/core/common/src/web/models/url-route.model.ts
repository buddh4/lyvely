import { IUrlRoute } from '../interfaces';
import { Expose } from 'class-transformer';

@Expose()
export class UrlRoute implements IUrlRoute {
  path?: string;
  query?: Record<string, string>;
  pid?: string;
}
