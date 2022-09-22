import { Injectable } from '@nestjs/common';
import { ModuleEvents } from '../core/modules/module.events';
import { Feature } from '../core/features/feature.interface';

@Injectable()
export class ProfileEvents extends ModuleEvents {

  getFeatures(): Feature[] {
    return [];
  }
}
