import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from "../config";
import { MisconfigurationException } from "../exceptions";

@Injectable()
export class UrlGenerator {
  constructor(private readonly configService: ConfigService<ConfigurationPath>) {}

  public getAppUrl(): URL;
  public getAppUrl(path: string): URL;
  public getAppUrl(path: Record<string, string>): URL;
  public getAppUrl(path: string, params: Record<string, string>): URL;
  public getAppUrl(path?: string|Record<string, string>, params?: Record<string, string>): URL {
    if(path && typeof path === 'object') {
      params = path;
      path = undefined;
    }

    const url = new URL(this.getBaseAppUrl());
    url.pathname = this.getPathString(<string> path);

    if(params) {
      Object.keys(params).forEach(name => url.searchParams.append(name, params[name]))
    }

    return url;
  }

  private getPathString(path?: string) {
    if(!path) {
      return '';
    }

    return path.startsWith('/') ? path.substring(1, path.length) : path;
  }

  private getBaseAppUrl() {
    const appUrl = this.configService.get('http.appUrl');

    if(!appUrl) {
      throw new MisconfigurationException('Could not generate app url, no http.appUrl setting configured');
    }

    return appUrl.endsWith('/') ? appUrl : appUrl + '/';
  }
}
