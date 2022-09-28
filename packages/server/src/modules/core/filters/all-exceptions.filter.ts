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
import { ForbiddenServiceException, EntityNotFoundException, EntityValidationException } from '../exceptions';

const exceptionLog = new Logger('exception');

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    exceptionLog.error(exception);
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const httpException = this.mapException(exception);

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message: httpException.message,
    });
  }

  mapException(exception: unknown): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof EntityValidationException) {
      return new BadRequestException();
    }

    if (exception instanceof EntityNotFoundException) {
      return new NotFoundException();
    }

    if (exception instanceof ForbiddenServiceException) {
      return new ForbiddenException();
    }

    return new InternalServerErrorException();
  }
}
