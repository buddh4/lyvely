import { Get, Param, Headers, Req, NotFoundException } from '@nestjs/common';
import { LegalEndpoint, LegalSectionDetails, ENDPOINT_LEGAL } from '@lyvely/legal-interface';
import { LegalService } from '../services';
import { Public, OptionalUserRequest, GlobalController } from '@lyvely/api';

@GlobalController(ENDPOINT_LEGAL)
export class LegalController implements LegalEndpoint {
  constructor(private readonly legalService: LegalService) {}

  @Public()
  @Get(':sectionId')
  async getLegalDetails(
    @Param('sectionId') sectionId,
    @Req() req: OptionalUserRequest,
    @Headers('accept-language') acceptLanguage?: string
  ): Promise<LegalSectionDetails> {
    const section = await this.legalService.getDetails(
      sectionId,
      req.user?.locale || acceptLanguage
    );
    if (!section) throw new NotFoundException();
    return section;
  }
}
