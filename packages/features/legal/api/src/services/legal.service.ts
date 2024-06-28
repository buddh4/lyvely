import { Injectable } from '@nestjs/common';
import { LyvelyConfigService } from '@lyvely/api';
import { LegalSection, LegalSectionDetails } from '@lyvely/legal-interface';
import type { ILegalOptions } from '../legal-options.interface';
import type { ModuleConfig } from '@lyvely/api';

@Injectable()
export class LegalService {
  constructor(
    private readonly configService: LyvelyConfigService<ModuleConfig<'legal', ILegalOptions>>
  ) {}

  async getSections(locale: string): Promise<LegalSection[]> {
    const result = [] as LegalSection[];
    const legal = this.configService.getModuleConfig('legal');
    if (!legal?.sections) return this.attachPoweredBy(result);

    for (const sectionId in legal.sections) {
      const localizedSection = this.getLocalizedSection(sectionId, locale);
      if (!localizedSection) continue;
      const { label, version, url } = localizedSection;
      result.push(
        new LegalSection({
          id: sectionId,
          label,
          version,
          url,
        })
      );
    }

    return this.attachPoweredBy(result);
  }

  private attachPoweredBy(result: LegalSection[]) {
    if (this.configService.getModuleConfig('poweredBy', true)) {
      result.push({
        id: 'poweredBy',
        label: 'Powered by lyvely',
        url: 'https://www.lyvely.app',
        version: '1.0',
      });
    }
    return result;
  }

  async getDetails(sectionId: string, locale?: string): Promise<LegalSectionDetails | null> {
    const localizedSection = this.getLocalizedSection(sectionId, locale);
    if (!localizedSection) return null;
    const { label, version, content, format, url } = localizedSection;
    return new LegalSectionDetails({
      id: sectionId,
      label,
      version,
      content,
      format,
      url,
    });
  }

  private getLocalizedSection(sectionId: string, locale?: string) {
    const legal = this.configService.getModuleConfig('legal');
    const section = legal?.sections[sectionId] || null;

    if (!locale || !section?.locales) return section;

    while (true) {
      if (section.locales[locale] || locale.indexOf('-') === -1) break;
      locale = locale.slice(0, locale.lastIndexOf('-'));
    }

    return section.locales[locale] || section;
  }
}
