export class ServiceException extends Error {
    constructor(msgOrData, msg) {
        super(typeof msgOrData === 'string' ? msgOrData : undefined);
        this.defaultMessage = 'Unknown service error';
        this.defaultStatus = 500;
        if (typeof msgOrData !== 'string') {
            this.message = msg || this.defaultMessage;
            this.data = msgOrData;
        }
    }
    getResponse() {
        return this.data;
    }
}
export class UnsupportedOperationException extends ServiceException {
    constructor(msgOrData, msg) {
        super(msgOrData, msg);
    }
}
export class EntityNotFoundException extends ServiceException {
    constructor(msgOrData, msg = 'Entity not found') {
        super(msgOrData, msg);
        this.status = 404;
    }
}
export class FieldValidationException extends ServiceException {
    constructor(msgOrFields, msg = 'Field validation failed.') {
        super(typeof msgOrFields === 'string' ? msgOrFields : { fields: msgOrFields || [] }, msg);
        this.status = 400;
    }
    getFields() {
        var _a;
        return ((_a = this.data) === null || _a === void 0 ? void 0 : _a.fields) || [];
    }
}
export class ModelValidationException extends ServiceException {
    constructor(msgOrResult, msg = 'Model validation failed.') {
        super(typeof msgOrResult === 'string' ? msgOrResult : undefined, msg);
        if (Array.isArray(msgOrResult)) {
            this.result = msgOrResult;
        }
        this.status = 400;
    }
    getResponse() {
        return { result: this.result || {} };
    }
    getResult() {
        return this.result;
    }
}
export class UnauthenticatedServiceException extends ServiceException {
    constructor(msgOrData, msg = 'Service action forbidden.') {
        super(msgOrData, msg);
        this.status = 401;
    }
}
export class ForbiddenServiceException extends ServiceException {
    constructor(msgOrData, msg = 'Service action forbidden.') {
        super(msgOrData, msg);
        this.status = 403;
    }
}
export class IntegrityException extends ServiceException {
    constructor(msgOrData, msg = 'An integrity exception occurred.') {
        super(msgOrData, msg);
        this.status = 400;
    }
}
export class MisconfigurationException extends ServiceException {
    constructor(msgOrData, msg = 'An error due to misconfiguration occurred.') {
        super(msgOrData, msg);
    }
}
export class NetworkException extends ServiceException {
    constructor(msgOrData, msg = 'An error due to network issues.') {
        super(msgOrData, msg);
    }
}
export class UniqueConstraintException extends FieldValidationException {
    constructor(field, msg) {
        super([{ property: field, errors: ['unique'] }], msg || `Unique constraint violation for field ${field}`);
        this.status = 500;
    }
}
export class RateLimitException extends ServiceException {
    constructor(msgOrData, retryAfter, msg = 'Too many requests.') {
        super(msgOrData, msg);
        this.status = 429;
        this.retryAfter = retryAfter;
    }
}
//# sourceMappingURL=index.js.map