import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { LyvelyConfigService } from '@/config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  constructor(private readonly configService: LyvelyConfigService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    if (!this.configService.get('http.debug')) return next();

    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      const body = request.body ? `Body: ${JSON.stringify(request.body)}` : '';
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip} ${body}`);
    });

    next();
  }
}
