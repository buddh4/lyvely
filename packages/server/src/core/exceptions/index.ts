export class ServiceException extends Error {
  protected defaultMessage = 'Unknown service error';

  constructor(msg?: string) {
    super(msg);
    if(!msg) {
      this.message = this.defaultMessage;
    }
  }
}

export class EntityNotFoundException extends ServiceException {
  protected defaultMessage = 'Entity not found';
}

export class EntityValidationException extends ServiceException {
  protected defaultMessage = 'Entity validation failed.';
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
