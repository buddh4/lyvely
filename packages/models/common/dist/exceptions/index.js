"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimitException = exports.UniqueConstraintException = exports.NetworkException = exports.MisconfigurationException = exports.IntegrityException = exports.ForbiddenServiceException = exports.UnauthenticatedServiceException = exports.ModelValidationException = exports.FieldValidationException = exports.EntityNotFoundException = exports.UnsupportedOperationException = exports.ServiceException = void 0;
class ServiceException extends Error {
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
exports.ServiceException = ServiceException;
class UnsupportedOperationException extends ServiceException {
    constructor(msgOrData, msg) {
        super(msgOrData, msg);
    }
}
exports.UnsupportedOperationException = UnsupportedOperationException;
class EntityNotFoundException extends ServiceException {
    constructor(msgOrData, msg = 'Entity not found') {
        super(msgOrData, msg);
        this.status = 404;
    }
}
exports.EntityNotFoundException = EntityNotFoundException;
class FieldValidationException extends ServiceException {
    constructor(msgOrFields, msg = 'Field validation failed.') {
        super(typeof msgOrFields === 'string' ? msgOrFields : { fields: msgOrFields || [] }, msg);
        this.status = 400;
    }
    getFields() {
        return this.data?.fields || [];
    }
}
exports.FieldValidationException = FieldValidationException;
class ModelValidationException extends ServiceException {
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
exports.ModelValidationException = ModelValidationException;
class UnauthenticatedServiceException extends ServiceException {
    constructor(msgOrData, msg = 'Service action forbidden.') {
        super(msgOrData, msg);
        this.status = 401;
    }
}
exports.UnauthenticatedServiceException = UnauthenticatedServiceException;
class ForbiddenServiceException extends ServiceException {
    constructor(msgOrData, msg = 'Service action forbidden.') {
        super(msgOrData, msg);
        this.status = 403;
    }
}
exports.ForbiddenServiceException = ForbiddenServiceException;
class IntegrityException extends ServiceException {
    constructor(msgOrData, msg = 'An integrity exception occurred.') {
        super(msgOrData, msg);
        this.status = 400;
    }
}
exports.IntegrityException = IntegrityException;
class MisconfigurationException extends ServiceException {
    constructor(msgOrData, msg = 'An error due to misconfiguration occurred.') {
        super(msgOrData, msg);
    }
}
exports.MisconfigurationException = MisconfigurationException;
class NetworkException extends ServiceException {
    constructor(msgOrData, msg = 'An error due to network issues.') {
        super(msgOrData, msg);
    }
}
exports.NetworkException = NetworkException;
class UniqueConstraintException extends FieldValidationException {
    constructor(field, msg) {
        super([{ property: field, errors: ['unique'] }], msg || `Unique constraint violation for field ${field}`);
        this.status = 500;
    }
}
exports.UniqueConstraintException = UniqueConstraintException;
class RateLimitException extends ServiceException {
    constructor(msgOrData, retryAfter, msg = 'Too many requests.') {
        super(msgOrData, msg);
        this.status = 429;
        this.retryAfter = retryAfter;
    }
}
exports.RateLimitException = RateLimitException;
