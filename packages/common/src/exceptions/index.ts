import { IModelValidationResult, IFieldValidationResult } from '@/validation';

export class ServiceException extends Error {
  protected defaultMessage = 'Unknown service error';
  protected defaultStatus = 500;
  public readonly data?: any;
  public status?: number;

  constructor(msgOrData?: string | any) {
    super(typeof msgOrData === 'string' ? msgOrData : undefined);
    if (typeof msgOrData !== 'string') {
      this.message = this.defaultMessage;
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
  protected defaultMessage = 'Use of unsupported operation';
}

export class EntityNotFoundException extends ServiceException {
  protected defaultMessage = 'Entity not found';

  constructor(msgOrData?: string | any) {
    super(msgOrData);
    this.status = 404;
  }
}

export class FieldValidationException extends ServiceException {
  protected defaultMessage = 'Field validation failed.';
  public readonly data?: { fields: IFieldValidationResult[] };

  constructor(msgOrFields: IFieldValidationResult[] | string) {
    super(typeof msgOrFields === 'string' ? msgOrFields : { fields: msgOrFields || [] });
    this.status = 400;
  }

  public getFields() {
    return this.data?.fields || [];
  }
}

export class ModelValidationException extends ServiceException {
  protected defaultMessage = 'Model validation failed.';
  private readonly result?: IModelValidationResult[];

  constructor(msgOrResult: IModelValidationResult[] | string) {
    super(typeof msgOrResult === 'string' ? msgOrResult : undefined);
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
  protected defaultMessage = 'Service action forbidden.';

  constructor(msgOrData?: string | any) {
    super(msgOrData);
    this.status = 401;
  }
}

export class ForbiddenServiceException extends ServiceException {
  protected defaultMessage = 'Service action forbidden.';

  constructor(msgOrData?: string | any) {
    super(msgOrData);
    this.status = 403;
  }
}

export class IntegrityException extends ServiceException {
  protected defaultMessage = 'An integrity exception occurred.';

  constructor(msgOrData?: string | any) {
    super(msgOrData);
    this.status = 400;
  }
}

export class MisconfigurationException extends ServiceException {
  protected defaultMessage = 'An error due to misconfiguration occurred.';
}

export class NetworkException extends ServiceException {
  protected defaultMessage = 'An error due to network issues.';
}

export class UniqueConstraintException extends FieldValidationException {
  protected defaultMessage = 'Selected name already exists.';

  constructor(msg?: string, field?: string) {
    super([{ property: field, errors: ['unique'] }]);
    this.status = 500;
  }
}

export class RateLimitException extends ServiceException {
  protected defaultMessage = 'Too many requests.';
  public retryAfter?: number;

  constructor(msgOrData?: string | any, retryAfter?: number) {
    super(msgOrData);
    this.status = 429;
    this.retryAfter = retryAfter;
  }
}
