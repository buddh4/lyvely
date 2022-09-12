import { Transform, Expose } from "class-transformer";
import { assignRawDataTo } from "../util/object.util";

export type DocumentMock<T> = {
    _id?: any
    id?: string,
    toJSON?: () => T,
}

export abstract class BaseModel<T> {
    constructor(obj?: Partial<T>) {
        if(obj) {
          assignRawDataTo(this, obj);
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

    constructor(obj?: Partial<T>) {
        if(!obj) {
          super();
          return;
        }

        if (obj && 'toJSON' in obj  && typeof obj.toJSON === 'function') {
            obj = obj.toJSON();
        }

        if('_id' in obj && typeof obj['_id'] === 'object') {
          obj.id = obj['_id'].toString();
        }

        super(obj);

        delete this['_id'];
    }
}
