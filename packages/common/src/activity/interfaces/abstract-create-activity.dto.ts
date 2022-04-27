import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { CalendarIntervalEnum } from '../../calendar';
import { Gte, Lte } from '../../model';
import { IActivity, isActivity } from './activity.interface';
import { Exclude } from 'class-transformer';
import { DataPointNumberInputStrategy } from '../../time-series';
import { UserAssignmentStrategy } from "../../user";

@Exclude()
export abstract class AbstractCreateActivityDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @Length(0, 2000)
    @IsOptional()
    text?: string;

    @IsEnum(CalendarIntervalEnum)
    interval: number

    @IsInt()
    @IsOptional()
    @Min(0)
    max?: number;

    @IsInt()
    @Max(100)
    @Min(-100)
    score: number;

    @IsInt()
    @Lte('max')
    @Min(0)
    min?: number;

    @IsInt()
    @Gte('min')
    @Lte('max')
    @Min(0)
    optimal?: number;

    @IsEnum(DataPointNumberInputStrategy)
    strategy?: DataPointNumberInputStrategy;

    @IsEnum(UserAssignmentStrategy)
    userStrategy?: UserAssignmentStrategy;

    @IsArray()
    @MaxLength(20, { each:true })
    categories: string[] = [];

    constructor(model?: IActivity | Partial<AbstractCreateActivityDto>) {
        // Defaults
        this.optimal = 0;
        this.max = 1;
        this.min = 0;
        this.score = 2;

        if(isActivity(model)) {
            this.title = model.title;
            this.text = model.text;
            this.interval = model.interval;
           /* this.max = model.rating.max;
            this.min = model.rating.min || 0;
            this.categories = model.categories || [];
            this.optimal = model.rating.optimal || 0;
            this.score = model.rating.value || 0;*/
        } else {
            Object.assign(this, model);
        }

        this.interval = this.interval ?? 0;
        this.min = Math.min(this.min ?? 0, this.max);
        this.optimal = Math.min(this.optimal ?? this.max, this.max);
        this.score = this.score ?? 0;
        this.strategy = this.strategy || DataPointNumberInputStrategy.CheckboxNumber;
    }
}
