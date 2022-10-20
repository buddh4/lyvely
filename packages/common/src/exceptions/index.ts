import { IModelValidationResult, IFieldValidationResult } from '@/validation';

export class ServiceException extends Error {
  protected defaultMessage = 'Unknown service error';
  public readonly data?: any;

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

export class EntityNotFoundException extends ServiceException {
  protected defaultMessage = 'Entity not found';
}

export class FieldValidationException extends ServiceException {
  protected defaultMessage = 'Field validation failed.';
  public readonly data?: { fields: IFieldValidationResult[] };

  constructor(msgOrFields: IFieldValidationResult[] | string) {
    super(typeof msgOrFields === 'string' ? msgOrFields : { fields: msgOrFields || [] });
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
}

export class ForbiddenServiceException extends ServiceException {
  protected defaultMessage = 'Service action forbidden.';
}

export class IntegrityException extends ServiceException {
  protected defaultMessage = 'An integrity exception occurred.';
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
  }
}
