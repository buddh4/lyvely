import { IModelValidationResult, IFieldValidationResult } from '../validation';

export class ServiceException<TData = any> extends Error {
  protected defaultMessage = 'Unknown service error';
  protected defaultStatus = 500;
  public readonly data?: TData;
  public status?: number;

  constructor(msgOrData?: string | any, msg?: string) {
    super(typeof msgOrData === 'string' ? msgOrData : undefined);
    if (typeof msgOrData !== 'string') {
      this.message = msg || this.defaultMessage;
      this.data = msgOrData;
    }
  }

  /**
   * @deprecated use data directly...
   */
  public getResponse() {
    return this.data;
  }
}

export class UnsupportedOperationException extends ServiceException {
  constructor(msgOrData?: string | any, msg?: string) {
    super(msgOrData, msg);
  }
}

export class EntityNotFoundException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'Entity not found') {
    super(msgOrData, msg);
    this.status = 404;
  }
}

export class FieldValidationException extends ServiceException<{
  fields: IFieldValidationResult[];
}> {
  constructor(msgOrFields: IFieldValidationResult[] | string, msg = 'Field validation failed.') {
    super(typeof msgOrFields === 'string' ? msgOrFields : { fields: msgOrFields || [] }, msg);
    this.status = 400;
  }

  public getFields() {
    return this.data?.fields || [];
  }

  public getFirstError(defaultMessage: string): string;
  public getFirstError(defaultMessage?: string): string | undefined {
    return this.data?.fields[0]?.errors?.[0];
  }
}

export class ModelValidationException extends ServiceException {
  private readonly result?: IModelValidationResult[];

  constructor(msgOrResult: IModelValidationResult[] | string, msg = 'Model validation failed.') {
    super(typeof msgOrResult === 'string' ? msgOrResult : undefined, msg);
    if (Array.isArray(msgOrResult)) {
      this.result = msgOrResult;
    }
    this.status = 400;
  }

  public getResponse() {
    return { result: this.result || {} };
  }

  public getResult() {
    return this.result;
  }
}

export class UnauthenticatedServiceException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'Service action forbidden.') {
    super(msgOrData, msg);
    this.status = 401;
  }
}

export class ForbiddenServiceException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'Service action forbidden.') {
    super(msgOrData, msg);
    this.status = 403;
  }
}

export class IntegrityException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'An integrity exception occurred.') {
    super(msgOrData, msg);
    this.status = 400;
  }
}

export class MisconfigurationException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'An error due to misconfiguration occurred.') {
    super(msgOrData, msg);
  }
}

export class NetworkException extends ServiceException {
  constructor(msgOrData?: string | any, msg = 'An error due to network issues.') {
    super(msgOrData, msg);
  }
}

export class UniqueConstraintException extends FieldValidationException {
  constructor(field: string, msg?: string) {
    super(
      [{ property: field, errors: ['unique'] }],
      msg || `Unique constraint violation for field ${field}`,
    );
  }
}

export class RateLimitException extends ServiceException {
  public retryAfter?: number;

  constructor(msgOrData?: string | any, retryAfter?: number, msg = 'Too many requests.') {
    super(msgOrData, msg);
    this.status = 429;
    this.retryAfter = retryAfter;
  }
}
