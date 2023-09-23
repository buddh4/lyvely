import { PropertiesOf } from '../utils/util.types';
export type DocumentMock<T> = {
    _id?: any;
    id?: string;
    toJSON?: () => Partial<PropertiesOf<T>>;
};
export type IGetDefaults = {
    getDefaults: () => any;
};
export declare function implementsGetDefaults(model: any): model is IGetDefaults;
export type IAfterInit = {
    afterInit: () => any;
};
export declare function implementsAfterInit(model: any): model is IAfterInit;
export declare abstract class BaseModel<T> {
    constructor(obj?: Partial<PropertiesOf<T>>);
}
export declare abstract class DocumentModel<T extends DocumentMock<T>> extends BaseModel<T> {
    id: string;
    _id?: object | string;
    constructor(obj?: Partial<PropertiesOf<T>>);
}
