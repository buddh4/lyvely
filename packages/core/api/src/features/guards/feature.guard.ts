import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getFeaturesFromContext } from '../decorators';
import { Reflector } from '@nestjs/core';
import { ProfileRequest } from '@/profiles';
import { ConfigService } from '@nestjs/config';
import { ServerConfiguration } from '@/core';
import { isEnabledFeature } from '@lyvely/interface';

@Injectable()
export class FeatureGuard implements CanActivate {
  @Inject()
  protected reflector: Reflector;

  @Inject()
  private configService: ConfigService<ServerConfiguration>;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const features = getFeaturesFromContext(context, this.reflector);
    const request = context.switchToHttp().getRequest<ProfileRequest>();

    const { profile } = request;

    if (!features?.length) return true;

    const featureConfig = this.configService.get('features', {});
    return features.reduce((result, featureId) => {
      return result && isEnabledFeature(featureId, profile, featureConfig);
    }, true);
  }
}
