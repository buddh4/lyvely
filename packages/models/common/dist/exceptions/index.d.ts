import { IModelValidationResult, IFieldValidationResult } from '../validation';
export declare class ServiceException extends Error {
    protected defaultMessage: string;
    protected defaultStatus: number;
    readonly data?: any;
    status?: number;
    constructor(msgOrData?: string | any, msg?: string);
    getResponse(): any;
}
export declare class UnsupportedOperationException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class EntityNotFoundException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class FieldValidationException extends ServiceException {
    readonly data?: {
        fields: IFieldValidationResult[];
    };
    constructor(msgOrFields: IFieldValidationResult[] | string, msg?: string);
    getFields(): IFieldValidationResult[];
}
export declare class ModelValidationException extends ServiceException {
    private readonly result?;
    constructor(msgOrResult: IModelValidationResult[] | string, msg?: string);
    getResponse(): {
        result: {};
    };
    getResult(): IModelValidationResult[] | undefined;
}
export declare class UnauthenticatedServiceException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class ForbiddenServiceException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class IntegrityException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class MisconfigurationException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class NetworkException extends ServiceException {
    constructor(msgOrData?: string | any, msg?: string);
}
export declare class UniqueConstraintException extends FieldValidationException {
    constructor(field: string, msg?: string);
}
export declare class RateLimitException extends ServiceException {
    retryAfter?: number;
    constructor(msgOrData?: string | any, retryAfter?: number, msg?: string);
}
