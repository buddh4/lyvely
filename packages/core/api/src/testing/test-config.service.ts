import { Inject, Injectable, Optional } from '@nestjs/common';
import { assignRawDataTo, findByPath } from '@lyvely/common';
import { CONFIGURATION_TOKEN } from '@nestjs/config/dist/config.constants';

@Injectable()
export class TestConfigService {
  private readonly initialConfig: Record<string, any>;

  constructor(
    @Optional()
    @Inject(CONFIGURATION_TOKEN)
    private internalConfig: Record<string, any> = {}
  ) {
    this.initialConfig = internalConfig;
  }

  get(key: string, def: any) {
    return findByPath(this.internalConfig, key, { defaultValue: def });
  }

  set(key: string, val: any) {
    assignRawDataTo(this.internalConfig, { [key]: val });
  }

  reset() {
    this.internalConfig = this.initialConfig;
  }
}
