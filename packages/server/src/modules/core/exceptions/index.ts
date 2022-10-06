import { IFieldValidationResult } from '@lyvely/common';

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

export class EntityValidationException extends ServiceException {
  protected defaultMessage = 'Entity validation failed.';
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

export class UniqueConstraintException extends IntegrityException {
  protected defaultMessage = 'Selected name already exists.';
  protected field: string;

  constructor(msg: string, field?: string) {
    super(msg);
    this.field = field;
  }

  getField() {
    return this.field;
  }
}
