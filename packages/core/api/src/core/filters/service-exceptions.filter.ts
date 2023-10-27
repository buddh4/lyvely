import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { ServiceException } from '@lyvely/common';

@Catch(ServiceException)
export class ServiceExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(ServiceExceptionsFilter.name);

  catch(exception: ServiceException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const responseData = exception.getResponse();
    const status = exception.status;

    if (status && status >= 500) {
      this.logger.error(exception.message, exception.stack);
    }

    if (!responseData) {
      response.status(status).json({
        statusCode: status,
        message: exception.message,
        error: exception.message,
      });
    } else if (typeof responseData === 'string') {
      response.status(status).json({
        statusCode: status,
        message: responseData,
        error: responseData,
      });
    } else {
      response.status(status).json(responseData);
    }
  }
}
