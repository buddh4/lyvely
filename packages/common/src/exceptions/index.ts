import { IModelValidationResult, IFieldValidationResult } from '@/validation';

export class ServiceException extends Error {
  protected defaultMessage = 'Unknown service error';

  constructor(msg?: string) {
    super(msg);
    if (!msg) {
      this.message = this.defaultMessage;
    }
  }

  public getResponse() {
    return undefined;
  }
}

export class EntityNotFoundException extends ServiceException {
  protected defaultMessage = 'Entity not found';
}

export class FieldValidationException extends ServiceException {
  protected defaultMessage = 'Field validation failed.';
  private readonly fields?: IFieldValidationResult[];

  constructor(msgOrFields: IFieldValidationResult[] | string) {
    super(typeof msgOrFields === 'string' ? msgOrFields : undefined);
    if (Array.isArray(msgOrFields)) {
      this.fields = msgOrFields;
    }
  }

  public getResponse() {
    return { fields: this.fields || [] };
  }

  public getFields() {
    return this.fields;
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

  constructor(msg: string, field?: string) {
    super([{ property: field, errors: ['unique'] }]);
  }
}
