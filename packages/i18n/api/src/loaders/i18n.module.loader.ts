import { I18nJsonLoader, I18nLoader, I18nTranslation, I18N_LOADER_OPTIONS } from 'nestjs-i18n';
import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { Observable, from, mergeMap, scan } from 'rxjs';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { merge } from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_REGISTRATION, IModuleMetadata, ModuleRegistry } from '@lyvely/core';
import { I18n } from '../components';

export interface I18nModuleLoaderOptions {
  watch?: boolean;
}

export class I18nModuleLoader extends I18nLoader implements OnModuleDestroy {
  moduleLoader: Map<string, I18nJsonLoader> = new Map<string, I18nJsonLoader>();
  logger = new Logger(I18nModuleLoader.name);

  constructor(
    private moduleRegistry: ModuleRegistry,
    @Inject(I18N_LOADER_OPTIONS)
    private options: I18nModuleLoaderOptions, //private i18n: I18n,
  ) {
    super();
    this.options.watch ??= false;
  }

  async onModuleDestroy() {
    this.moduleLoader.forEach((loader) => {
      loader.onModuleDestroy();
    });
  }

  @OnEvent(EVENT_MODULE_REGISTRATION)
  async onModuleRegistration(metaData: IModuleMetadata) {
    return this.createModuleLoader(metaData);
  }

  createModuleLoaders() {
    this.moduleRegistry.getAllMeta().forEach((moduleMeta) => {
      this.logger.log(`Create i18n loader for ${moduleMeta.id}`);
      this.createModuleLoader(moduleMeta);
    });
  }

  createModuleLoader(metaData: IModuleMetadata) {
    try {
      const localesPath = resolve(metaData.path, 'locales');

      if (!existsSync(localesPath)) return;

      const loader = new I18nJsonLoader({ path: localesPath, watch: this.options.watch });
      this.moduleLoader.set(metaData.id, loader);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    return ['en'];
    //this.i18n.getEnabledLocales();
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (!this.moduleLoader.size) {
      this.createModuleLoaders();
    }

    const loaders = Array.from(this.moduleLoader.values());

    if (this.options.watch) {
      const observables = loaders.map((loader) => loader.load());

      return from(observables).pipe(
        mergeMap((result) => result),
        scan((acc, value) => merge({}, acc, value), {}), // Deep merge using Lodash
      );
    }

    const result: I18nTranslation[] = [];
    for (const loader of loaders.values()) {
      const translations = await loader.load();

      if (translations instanceof Observable) continue;

      result.push(translations);
    }

    return merge({}, ...result);
  }
}
