import { plainToInstance, Transform, Expose, ClassConstructor } from "class-transformer";

export type DocumentMock<T> = {
    _id?: any
    id?: string,
    toJSON?: () => T,
}

export abstract class BaseModel<T> {
    constructor(obj?: Partial<T>) {
        if(!obj) return;

        Object.assign(this, obj);

        if('afterInit' in this) {
            (<this & { afterInit: (() => void)}> this).afterInit();
        }
    }
}

export abstract class BaseDto<T> {
    constructor(obj?: Partial<T>, options?: { sanitize: boolean }) {
        if(!obj) return;

        const initData = options?.sanitize === false ? obj : sanitizeModelData<T>(this.constructor, obj);
        Object.assign(this, initData);

        if('afterInit' in this) {
            (<this & { afterInit: (() => void)}> this).afterInit();
        }
    }
}

export function sanitizeModelData<T>(constructor: Function, obj: any) {
   // return  instanceToPlain(
    return  plainToInstance(
        <ClassConstructor<T>> constructor, obj, { enableImplicitConversion: false }
      )
   // );
}

export abstract class DocumentDto<T extends DocumentMock<T>> extends BaseDto<T> {
    @Expose()
    @Transform(({ value, obj }) => obj._id?.toString() || value)
    id: string;

    constructor(obj?: Partial<T>, options?: { sanitize: boolean }) {
        if (obj && 'toJSON' in obj  && typeof obj.toJSON === 'function') {
            obj = obj.toJSON();
        }
        super(obj, options);
    }
}