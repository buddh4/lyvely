import { Injectable } from '@nestjs/common';
import { MisconfigurationException, UrlRoute } from '@lyvely/interface';
import { LyvelyConfigService } from '@/config/services';

@Injectable()
export class UrlGenerator {
  constructor(protected readonly configService: LyvelyConfigService) {}

  public getAppUrl(route?: UrlRoute): URL {
    return this.generateUrl(this.getBaseAppUrl(), route);
  }

  public getApiUrl(route?: UrlRoute): URL {
    return this.generateUrl(this.getBaseApiUrl(), route);
  }

  protected generateUrl(baseUrl: string, route?: UrlRoute) {
    const url = new URL(baseUrl);
    url.pathname += this.getPathString(route?.path);

    if (route?.query) {
      Object.keys(route.query).forEach((name) => url.searchParams.append(name, route.query![name]));
    }

    return url;
  }

  protected getPathString(path?: string) {
    if (!path) return '';

    return path.startsWith('/') ? path.substring(1, path.length) : path;
  }

  protected getBaseApiUrl() {
    const appUrl = this.configService.get('http.baseUrl');

    if (!appUrl) {
      throw new MisconfigurationException(
        'Could not generate app url, no http.appUrl setting configured'
      );
    }

    return appUrl.endsWith('/') ? appUrl : appUrl + '/';
  }

  protected getBaseAppUrl() {
    const appUrl = this.configService.get('http.appUrl');

    if (!appUrl) {
      throw new MisconfigurationException(
        'Could not generate app url, no http.appUrl setting configured'
      );
    }

    return appUrl.endsWith('/') ? appUrl : appUrl + '/';
  }
}
