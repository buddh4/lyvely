import { Injectable, Logger } from '@nestjs/common';
import { Feature } from './feature.interface';

@Injectable()
export class FeatureRegistry {
  private featureMap: Record<string, Feature> = {};
  private readonly logger = new Logger(FeatureRegistry.name);

  registerFeature(feature: Feature) {
    this.logger.log(`Register feature ${feature.id}`);
    this.featureMap[feature.id] = feature;
  }

  registerFeatures(definitions: Feature[]) {
    definitions.forEach((def) => this.registerFeature(def));
  }

  isRegisteredType(type: string): boolean {
    return !!this.getFeature(type);
  }

  isEnabledFeature(id: string): boolean {
    let result = true;

    // Make sure all parent features are enabled as well
    do {
      result = result && !!this.getFeature(id)?.enabled;
    } while(id = id.substring(0, id.lastIndexOf('.')))

    return result;
  }

  getFeature(id: string): Feature | undefined {
    const result = this.featureMap[id];
    if(!result) {
      this.logger.warn(`Feature ${id} without content type definition requested`);
    }
    return result;
  }
}