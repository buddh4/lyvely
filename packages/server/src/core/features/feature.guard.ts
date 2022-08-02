import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FeatureRegistry } from './feature.registry';
import { getFeaturesFromContext } from './feature.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class FeatureGuard implements CanActivate {

  @Inject()
  private featureRegistry: FeatureRegistry;

  @Inject()
  protected reflector: Reflector;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const features = getFeaturesFromContext(context, this.reflector);

    if(!features?.length) {
      return true;
    }

    return features.reduce(
      (prev, current) => prev && !!this.featureRegistry.isEnabledFeature(current), true);
  }
}
