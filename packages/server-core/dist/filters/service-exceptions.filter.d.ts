import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { ServiceException } from '@lyvely/common';
export declare class ServiceExceptionsFilter implements ExceptionFilter {
    private logger;
    catch(exception: ServiceException, host: ArgumentsHost): void;
}
