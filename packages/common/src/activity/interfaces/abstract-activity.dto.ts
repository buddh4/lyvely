import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Length, } from 'class-validator';
import { CalendarIntervalEnum } from '../../calendar';
import type { INumberDataPointConfig } from '../../time-series';
import { DataPointInputStrategy, DataPointInputType, DataPointValueType } from "../../time-series";
import { DocumentDto } from '../../model';
import { ActivityType, IActivity } from './activity.interface';
import { Exclude, Expose } from 'class-transformer';
import { UserAssignmentStrategy } from "../../user";

@Exclude()
export class AbstractActivity<T extends IActivity> extends DocumentDto<T> implements IActivity {

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
    categories: string[];

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
        this.categories = this.categories || [];
        this.dataPointConfig = this.dataPointConfig || {
          interval: CalendarIntervalEnum.Daily,
          inputType: DataPointInputType.Checkbox,
          valueType: DataPointValueType.Number,
          strategy: DataPointInputStrategy.CheckboxNumber,
          history: []
        };

    }
}
