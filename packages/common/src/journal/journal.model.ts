import type { IJournal, IJournalLog } from "./journal.interface";
import {
    IsArray,
    IsBoolean,
    isBoolean,
    IsDefined,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
    Min
} from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { DocumentDto, Gte, Lte, sortBySortOrder } from '../model';
import { IContent } from '../content';
import {
    IDataPointConfig,
    DataPointValueType,
    DataPointInputType,
    TimeSeriesDataPointStore
} from '../time-series';
import { CalendarIntervalEnum, REGEX_DATE_FORMAT } from '../calendar';
import { UserAssignmentStrategy } from "../user";

export class JournalDto extends DocumentDto<JournalDto> implements IJournal {
    id: IJournal['id'];
    title: string;
    archived: boolean;
    tagNames: string[];
   // rating: IRating;
    dataPointConfig: IDataPointConfig;
    userStrategy: UserAssignmentStrategy;
    description?: string;
    interval: CalendarIntervalEnum;
    sortOrder: number;
    type = 'Journal';
    visibility: number;
    tagIds: string[];

    constructor(obj?: Partial<JournalDto>) {
        super(obj);
        if (!isBoolean(this.archived)) {
            this.archived = false;
        }

        if (!this.tagNames) {
            this.tagNames = [];
        }
    }


}

@Exclude()
export class JournalLogDto {
    @Expose()
    id: IContent['id'];

    @Expose()
    value: number;

    @Expose()
    text: string;

    @Expose()
    timingId: string;

    @Exclude()
    content: IJournal;

    @Expose()
    cid: string;

    static createFor(journal: IJournal, timingId: string) {
        return null;
       /* return new JournalLogDto({
            journal: journal,
            contentId: journal.id,
            value: 0,
            text: '',
            timingId:timingId
        });*/
    }
}

@Exclude()
export class EditJournalDto {

    @Exclude()
    id?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDefined()
    @IsEnum(DataPointValueType)
    dataPointValueType: DataPointValueType;

    @IsDefined()
    @IsEnum(DataPointInputType)
    inputType: DataPointInputType;

    type = 'Journal';

    @IsString()
    @Length(0, 2000)
    @IsOptional()
    description?: string;

    @IsEnum(CalendarIntervalEnum)
    interval: number;

    @IsInt()
    @Min(1)
    max: number;

    @IsInt()
    @Lte('max')
    min?: number;

    @IsInt()
    @Gte('min')
    @Lte('max')
    @Min(0)
    optimal?: number;

    @IsBoolean()
    @IsOptional()
    archived?: boolean;

    @IsString()
    @IsDefined()
    profile: string;

    @IsArray()
    @MaxLength(20, { each: true })
    categories: string[] = [];

    constructor(obj: Partial<EditJournalDto>) {
        Object.assign(this, obj);
        this.min = Math.min(this.min ?? 0, this.max);
        this.optimal = Math.min(this.optimal ?? this.max, this.max);
    }

    public static createInitialModel(profile: string) {
        return new EditJournalDto({
            title: '',
            description: '',
            profile: profile,
            interval: CalendarIntervalEnum.Daily,
            dataPointValueType: DataPointValueType.Number,
            type: 'Journal',
            inputType: DataPointInputType.Range,
            categories: [],
            min: -10,
            max: 10,
            optimal: 10
        });
    }

    public static createEdit(model: IJournal, profile: string) {
        const result = new EditJournalDto(model);
     /*   result.inputType = model.rating.inputType;
        result.DataPointValueType = model.rating.type;
        result.type = 'Journal';
        result.min = model.rating.min;
        result.max = model.rating.max;
        result.optimal = model.rating.optimal;
        result.profile = profile;*/
        return result;
    }
}

@Exclude()
export class UpdateJournalLogDto {
    @Matches(REGEX_DATE_FORMAT)
    date: string;

    @IsNumber()
    value: number;

    @IsString()
    text: string;

    constructor(obj: Partial<UpdateJournalLogDto>) {
        Object.assign(this, obj);
    }
}

@Expose()
export class UpdateJournalLogResultDto {
    value: number;
    text: string;

    constructor(obj: Partial<UpdateJournalLogResultDto>) {
        Object.assign(this, obj);
    }
}

export interface JournalRangeResponse {
    journals: IJournal[];
    logs: IJournalLog[];
}

@Exclude()
export class JournalRangeResponseDto implements JournalRangeResponse {
    @IsArray()
    @Type(() => JournalDto)
    public journals: IJournal[] = [];

    @IsArray()
    @Type(() => JournalLogDto)
    public logs: IJournalLog[] = [];

    constructor(obj?: Partial<JournalRangeResponseDto>) {
        if (obj) {
            Object.assign(this, obj);
        }
    }

    addJournal(journal: IJournal) {
        this.journals.push(new JournalDto(journal));
    }

    addJournals(journals: IJournal[]) {
        journals.forEach(journal => this.addJournal(journal));
    }

    addLog(log: IJournalLog) {
       // this.logs.push(new JournalLogDto(log));
    }

    addLogs(logs: IJournalLog[]) {
       // logs.forEach((log) => this.addDataPoint(log));
    }
}

export class JournalLogStore extends TimeSeriesDataPointStore<IJournal, IJournalLog> {
    createDataPoint(model: IJournal, timingId: string): IJournalLog {
        return JournalLogDto.createFor(model, timingId);
    }

    sort(models: IJournal[]) {
        return models.sort(sortBySortOrder);
    }
}
