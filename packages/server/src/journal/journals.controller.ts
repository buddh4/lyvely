/*import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import {
  EditJournalDto,
  JournalDto,
  JournalRangeResponse,
  JournalRangeResponseDto,
} from 'lyvely-common';
import { TimeSeriesRangeFilter } from 'lyvely-common';
import { Journal, JournalDocument } from './schemas/journal.schema';
import {
  UpdateJournalLogDto,
  UpdateJournalLogResultDto,
} from 'lyvely-common';
import { User } from '../users/schemas/users.schema';
import { JournalLogsService } from './journallogs.service';

@Controller('journals')
export class JournalsController {
  @Inject()
  private journalService: JournalsService;

  @Inject()
  private journalLogService: JournalLogsService;

  /*  @Post()
   @UseInterceptors(ClassSerializerInterceptor)
   async create(
     @Request() req,
     @Body() dto: EditJournalDto,
   ): Promise<JournalDto> {
     const profile = await this.findProfileMembershipByUserAndId(req.user, dto.profile);
     const journal = await this.journalService.create(
       profile,
       Journal.create(profile, dto),
     );

     if (!journal) {
       throw new InternalServerErrorException();
     }

     return new JournalDto(journal);
   }

  @Get()
   @UseInterceptors(ClassSerializerInterceptor)
   async findByRange(
     @Request() req,
     @Query(new ValidationPipe({ transform: true })) filter: CalendarRangeFilter,
   ): Promise<JournalRangeResponse> {
     const result = new JournalRangeResponseDto();
     //result.addJournals(await this.journalService.findByOwner(req.user));
     result.addLogs(
       await this.journalLogService.findLogsByRange(req.user, filter),
     );
     return result;
   }

   @Post(':id/update-log')
   @UseInterceptors(ClassSerializerInterceptor)
   async updateLog(
     @Request() req,
     @Param('id') id,
     @Body() dto: UpdateJournalLogDto,
   ): Promise<UpdateJournalLogResultDto> {
     const journal = await this.findUserJournal(req.user, id);
     const profile = await this.findProfileByUserAndId(
       req.user,
       <any>journal.profile,
     );
     const log = await this.journalLogService.updateLog(
       req.user,
       profile,
       journal,
       dto.date,
       dto,
     );
     return new UpdateJournalLogDto({ value: log.value, text: log.text });
   }

   private async findUserJournal(
     user: User,
     id: string,
   ): Promise<JournalDocument> {
     const journal = await this.journalService.findByOwnerAndId(user, id);

     if (!journal) {
       throw new NotFoundException();
     }

     return journal;
   }


}*/
