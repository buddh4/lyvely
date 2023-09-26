import { I18nJsonLoader, I18nLoader, I18nTranslation, I18N_LOADER_OPTIONS } from 'nestjs-i18n';
import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { Observable, from, mergeMap, scan, firstValueFrom } from 'rxjs';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { merge } from 'lodash';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_REGISTRATION, IModuleMetadata, ModuleRegistry } from '@lyvely/core';
import { ConfigService } from '@nestjs/config';
import { I18nConfigPath } from '../interfaces';

export interface I18nModuleLoaderOptions {
  //watch?: boolean;
}

export class I18nModuleLoader extends I18nLoader implements OnModuleDestroy {
  moduleLoader: Map<string, I18nJsonLoader> = new Map<string, I18nJsonLoader>();
  logger = new Logger(I18nModuleLoader.name);

  constructor(
    private moduleRegistry: ModuleRegistry,
    @Inject(I18N_LOADER_OPTIONS)
    private options: I18nModuleLoaderOptions, //private i18n: I18n,
    private configService: ConfigService<I18nConfigPath>,
  ) {
    super();
    //this.options.watch ??= false;
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
      this.logger.debug(`Create i18n loader for ${moduleMeta.id}`);
      this.createModuleLoader(moduleMeta);
    });
  }

  createModuleLoader(metaData: IModuleMetadata) {
    try {
      const localesPath = resolve(metaData.path, 'locales');

      if (!existsSync(localesPath)) return;

      const loader = new I18nJsonLoader({ path: localesPath, watch: false });
      this.moduleLoader.set(metaData.id, loader);
    } catch (e) {
      this.logger.error(e);
    }
  }

  async languages(): Promise<string[] | Observable<string[]>> {
    return this.configService.get('modules.i18n.locals') || ['en'];
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (!this.moduleLoader.size) {
      this.createModuleLoaders();
    }

    /*
      TODO: doen't work at the moment
      if (this.options.watch) {
        return this.loadModuleTranslationsAndWatch();
      }
    }*/

    return this.loadModuleTranslations();
  }

  private async loadModuleTranslations() {
    const result: I18nTranslation[] = [];
    for (const [moduleId, loader] of this.moduleLoader) {
      this.logger.debug(`Load translations for ${moduleId}`);
      let translations = await loader.load();

      if (translations instanceof Observable) {
        translations = await firstValueFrom(translations);
      }

      const mappedTranslation: I18nTranslation = {};
      for (const locale in translations) {
        if (Object.hasOwn(translations, locale)) {
          mappedTranslation[locale] = { [moduleId]: translations[locale] };
        }
      }
      result.push(mappedTranslation);
    }

    return merge({}, ...result);
  }

  private async loadModuleTranslationsAndWatch() {
    const loadersWithKeys = Array.from(this.moduleLoader.entries()).map(([key, loader]) => ({
      key,
      loader,
    }));
    const observables = loadersWithKeys.map(({ loader }) => loader.load());

    return from(observables).pipe(
      mergeMap((result) => result),
      scan(async (acc, value, index) => {
        const moduleId = loadersWithKeys[index].key; // Access the key
        const translations = value instanceof Observable ? await firstValueFrom(value) : value;
        const mappedTranslation: I18nTranslation = {};
        for (const locale in translations) {
          if (Object.hasOwn(translations, locale)) {
            mappedTranslation[locale] = { [moduleId]: translations[locale] };
          }
        }
        return merge({}, acc, mappedTranslation);
      }, {}),
    );
  }
}
