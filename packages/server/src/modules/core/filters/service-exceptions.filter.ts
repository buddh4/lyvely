import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import {
  ForbiddenServiceException,
  EntityNotFoundException,
  EntityValidationException,
  ServiceException,
} from '../exceptions';

const exceptionLog = new Logger('exception');

@Catch(ServiceException)
export class ServiceExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    exceptionLog.error(exception);
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpException = this.mapException(exception);
    const responseData = httpException.getResponse();
    if (!responseData) {
      response.status(httpException.getStatus()).json({
        statusCode: httpException.getStatus(),
        message: httpException.message,
      });
    } else if (typeof responseData === 'string') {
      response.status(httpException.getStatus()).json({
        statusCode: httpException.getStatus(),
        message: responseData,
      });
    } else {
      response.response.status(httpException.getStatus()).json(responseData);
    }
  }

  mapException(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof EntityValidationException) {
      return new BadRequestException(exception.getResponse());
    }

    if (exception instanceof EntityNotFoundException) {
      return new NotFoundException(exception.getResponse());
    }

    if (exception instanceof ForbiddenServiceException) {
      return new ForbiddenException(exception.getResponse());
    }

    return new InternalServerErrorException();
  }
}
