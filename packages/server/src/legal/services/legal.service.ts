import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationPath, LegalOptions } from '@/core';
import { LegalSection, LegalSectionDetails } from '@lyvely/common';

@Injectable()
export class LegalService {
  constructor(private readonly configService: ConfigService<ConfigurationPath>) {}

  async getSections(locale?: string): Promise<LegalSection[]> {
    const result = [] as LegalSection[];
    const legal = this.configService.get<LegalOptions>('legal');
    if (!legal?.sections) return result;

    for (const sectionId in legal.sections) {
      const localizedSection = this.getLocalizedSection(sectionId, locale);
      const { label, version } = localizedSection;
      result.push(
        new LegalSection({
          id: sectionId,
          label,
          version,
        }),
      );
    }

    return result;
  }

  async getDetails(sectionId: string, locale?: string): Promise<LegalSectionDetails | null> {
    const localizedSection = this.getLocalizedSection(sectionId, locale);
    if (!localizedSection) return null;
    const { label, version, content, format } = localizedSection;
    return new LegalSectionDetails({
      id: sectionId,
      label,
      version,
      content,
      format,
    });
  }

  private getLocalizedSection(sectionId: string, locale?: string) {
    const legal = this.configService.get<LegalOptions>('legal');
    const section = legal?.sections[sectionId] || null;
    return (locale && section?.locales?.[locale]) || section;
  }
}
