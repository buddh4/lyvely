import { CalendarPlanFilter } from '@/calendar-plan';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PropertyType } from '@/models';

@Exclude()
export class MilestonePlanSearchFilter extends CalendarPlanFilter {
  @IsBoolean()
  @IsOptional()
  @PropertyType(Boolean, { default: true })
  withRelations?: boolean;
}
