import { Inject, Injectable, Optional } from '@nestjs/common';
import { findByPath, assignRawDataTo } from '@lyvely/common';
import { CONFIGURATION_TOKEN } from '@nestjs/config/dist/config.constants';

@Injectable()
export class TestConfigService {
  private initialConfig: Record<string, any>;
  constructor(
    @Optional()
    @Inject(CONFIGURATION_TOKEN)
    private internalConfig: Record<string, any> = {},
  ) {
    this.initialConfig = internalConfig;
  }

  get(key: string, def: any) {
    const result = findByPath(this.internalConfig, key);
    return result || def;
  }

  set(key: string, val: any) {
    assignRawDataTo(this.internalConfig, { [key]: val });
  }

  reset() {
    this.internalConfig = this.initialConfig;
  }
}
