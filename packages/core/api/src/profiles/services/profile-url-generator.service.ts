import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { assureStringId, UrlGenerator } from '@/core';
import { ConfigurationPath } from '@/config';
import { UrlRoute } from '@lyvely/interface';

@Injectable()
export class ProfileUrlGenerator extends UrlGenerator {
  constructor(protected override readonly configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  public override getAppUrl(route?: UrlRoute): URL {
    if (route && 'pid' in route) {
      route.path = `/p/${assureStringId(route.pid)}/${this.getPathString(route.path)}`;
    }

    return super.getAppUrl(route);
  }

  public override getApiUrl(route?: UrlRoute): URL {
    if (route && 'pid' in route) {
      if (!route.query) {
        route.query = {};
      }

      route.query['pid'] = assureStringId(route.pid)!;
    }

    return this.generateUrl(this.getBaseApiUrl(), route);
  }
}
