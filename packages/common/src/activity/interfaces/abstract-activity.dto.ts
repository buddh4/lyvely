import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Length, } from 'class-validator';
import { CalendarIntervalEnum } from '../../calendar';
import type { INumberDataPointConfig } from '../../time-series';
import { DataPointInputStrategy, DataPointInputType, DataPointValueType } from "../../time-series";
import { DocumentModel } from '../../model';
import { ActivityType, IActivity } from './activity.interface';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserAssignmentStrategy } from "../../user";

@Exclude()
export class AbstractActivityDto<T extends IActivity> extends DocumentModel<T> implements IActivity {

    @Expose()
    dataPointConfig: INumberDataPointConfig;

    @Expose()
    @IsString()
    @IsNotEmpty()
    @Length(1, 80)
    title: string;

    @Expose()
    @IsString()
    text:string;

    @Expose()
    @IsEnum(ActivityType)
    type: string;

    @Expose()
    @IsArray()
    @Transform(({ value, obj }) => obj.tagIds?.map(id => id.toString()) || [])
    tagIds: string[];

    @Expose()
    @IsNumber()
    visibility: number;

    @Expose()
    @IsBoolean()
    archived: boolean;

    @Expose()
    @IsNumber()
    sortOrder: number;

    @Expose()
    @IsNumber()
    score: number;

    @Expose()
    @IsEnum(UserAssignmentStrategy)
    userStrategy: UserAssignmentStrategy;

    constructor(obj?: Partial<T> & { _id?: any }) {
        super(obj);
        this.archived = !!this.archived;
        this.dataPointConfig = this.dataPointConfig || {
          interval: CalendarIntervalEnum.Daily,
          inputType: DataPointInputType.Checkbox,
          valueType: DataPointValueType.Number,
          strategy: DataPointInputStrategy.CheckboxNumber,
          history: []
        };
    }
}
