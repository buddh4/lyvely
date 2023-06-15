import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { assureStringId, UrlGenerator, ConfigurationPath } from '@lyvely/server-core';
import { UrlRoute } from '@lyvely/common';

@Injectable()
export class ProfileUrlGenerator extends UrlGenerator {
  constructor(protected readonly configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  public getAppUrl(route?: UrlRoute): URL {
    if (route && 'pid' in route) {
      route.path = `/p/${assureStringId(route.pid)}/${this.getPathString(route.path)}`;
    }

    return super.getAppUrl(route);
  }

  public getApiUrl(route?: UrlRoute): URL {
    if (route && 'pid' in route) {
      if (!route.query) {
        route.query = {};
      }

      route.query['pid'] = assureStringId(route.pid);
    }

    return this.generateUrl(this.getBaseApiUrl(), route);
  }
}
