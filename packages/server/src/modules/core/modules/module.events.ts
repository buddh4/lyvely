import { Inject, OnModuleInit } from '@nestjs/common';
import { IFeature } from '../features/feature.interface';
import { FeatureRegistry } from '../features/feature.registry';

export abstract class ModuleEvents implements OnModuleInit {

  @Inject()
  private featureRegistry: FeatureRegistry

  abstract getFeatures(): IFeature[];

  onModuleInit(): any {
   this.registerFeatures();
  }

  private registerFeatures() {
    const features = this.getFeatures();
    if(features && features.length) {
      this.featureRegistry.registerFeatures(features);
    }
  }
}
