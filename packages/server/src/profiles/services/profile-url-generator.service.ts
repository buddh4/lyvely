import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { assureStringId, EntityIdentity, UrlGenerator, ConfigurationPath } from '@/core';
import { Profile } from '../schemas';

export interface UrlRoute {
  path?: string;
  params?: Record<string, string>;
}

export interface ProfileRoute extends UrlRoute {
  params?: Record<string, string>;
  pid?: EntityIdentity<Profile>;
}

@Injectable()
export class ProfileUrlGenerator extends UrlGenerator {
  constructor(protected readonly configService: ConfigService<ConfigurationPath>) {
    super(configService);
  }

  public getAppUrl(route?: ProfileRoute): URL {
    if (route && 'pid' in route) {
      route.path = `/p/${assureStringId(route.pid)}/${this.getPathString(route.path)}`;
    }

    return super.getAppUrl(route);
  }

  public getApiUrl(route?: ProfileRoute): URL {
    if (route && 'pid' in route) {
      if (!route.params) {
        route.params = {};
      }

      route.params['pid'] = assureStringId(route.pid);
    }

    return this.generateUrl(this.getBaseApiUrl(), route);
  }
}
