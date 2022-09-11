import { Transform, Expose } from "class-transformer";

export type DocumentMock<T> = {
    _id?: any
    id?: string,
    toJSON?: () => T,
}

export abstract class BaseModel<T> {
    constructor(obj?: Partial<T>, options?: { sanitize: boolean }) {
        if(obj) {
          Object.assign(this, obj);
        }

        if('afterInit' in this) {
            (<this & { afterInit: (() => void)}> this).afterInit();
        }
    }
}

export abstract class DocumentModel<T extends DocumentMock<T>> extends BaseModel<T> {
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
