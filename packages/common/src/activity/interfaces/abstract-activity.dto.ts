import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    Length,
} from 'class-validator';
import { CalendarIntervalEnum } from '../../calendar';
import { INumberDataPointConfig } from '../../time-series';
import { DocumentDto } from '../../model';
import { ActivityType, IActivity } from './activity.interface';
import { Exclude, Expose } from 'class-transformer';
import { UserAssignmentStrategy } from "../../user";

@Exclude()
export class AbstractActivity<T extends IActivity> extends DocumentDto<T> implements IActivity {
    @Expose()
    id: IActivity['id'];

    @Expose()
    @IsEnum(CalendarIntervalEnum)
    @IsDefined()
    interval: CalendarIntervalEnum;

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

    }
}
