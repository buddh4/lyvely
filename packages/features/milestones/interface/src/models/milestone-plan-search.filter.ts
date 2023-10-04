import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PropertyType } from '@lyvely/common';

@Exclude()
export class MilestonePlanSearchFilter extends CalendarPlanFilter {
  @IsBoolean()
  @IsOptional()
  @PropertyType(Boolean, { default: true })
  withRelations?: boolean;
}
