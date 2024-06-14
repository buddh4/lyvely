import { I18nJsonLoader, I18nLoader, I18nTranslation, I18N_LOADER_OPTIONS } from 'nestjs-i18n';
import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { Observable, from, mergeMap, scan, firstValueFrom, mergeAll } from 'rxjs';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { merge } from '@lyvely/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT_MODULE_REGISTRATION, IModuleMetadata, ModuleRegistry } from '@/core';
import { ConfigService } from '@nestjs/config';
import { I18nConfigPath } from '../interfaces';

export interface I18nModuleLoaderOptionsIF {
  watch?: boolean;
}

export class I18nModuleLoader extends I18nLoader implements OnModuleDestroy {
  moduleLoader: Map<string, I18nJsonLoader> = new Map<string, I18nJsonLoader>();
  logger = new Logger(I18nModuleLoader.name);

  constructor(
    private moduleRegistry: ModuleRegistry,
    @Inject(I18N_LOADER_OPTIONS)
    private options: I18nModuleLoaderOptionsIF, //private i18n: I18n,
    private configService: ConfigService<I18nConfigPath>
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
      this.logger.debug(`Create i18n loader for ${moduleMeta.id}`);
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
    return this.configService.get('modules.i18n.locals') || ['en'];
  }

  async load(): Promise<I18nTranslation | Observable<I18nTranslation>> {
    if (!this.moduleLoader.size) {
      this.createModuleLoaders();
    }

    if (this.options.watch) {
      return this.loadModuleTranslationsAndWatch();
    }

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

      result.push(this.addModulePrefix(translations, moduleId));
    }

    return merge({}, ...result);
  }

  private addModulePrefix(translations: I18nTranslation, moduleId: string): I18nTranslation {
    const mappedTranslation: I18nTranslation = {};
    for (const locale in translations) {
      if (Object.hasOwn(translations, locale)) {
        mappedTranslation[locale] = { [moduleId]: translations[locale] };
      }

      if (mappedTranslation[locale]?.[moduleId]?.[moduleId]) {
        merge(mappedTranslation[locale][moduleId], mappedTranslation[locale][moduleId][moduleId]);
        delete mappedTranslation[locale][moduleId][moduleId];
      }
    }
    return mappedTranslation;
  }

  private async loadModuleTranslationsAndWatch() {
    const loadersWithKeys = Array.from(this.moduleLoader.entries()).map(([key, loader]) => ({
      key,
      loader,
    }));

    const observables = loadersWithKeys.map(({ loader }) => loader.load());

    return Promise.all(observables).then(
      (observables: Array<I18nTranslation | Observable<I18nTranslation>>) => {
        const filtered = observables.filter((o) => o instanceof Observable) as Array<
          Observable<I18nTranslation>
        >;

        // Convert the array of Observables into an Observable and merge them
        return from(filtered).pipe(
          mergeAll(),
          mergeMap((obj, index) => {
            return new Observable((subscriber) => {
              subscriber.next(this.addModulePrefix(obj, loadersWithKeys[index].key));
              subscriber.complete();
            });
          }),
          scan((acc, value) => {
            return { ...acc, ...(value as any) };
          }, {})
        );
      }
    );
  }
}
