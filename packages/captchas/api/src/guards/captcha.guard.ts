import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CaptchaService } from '../services';
import { Request } from 'express';
import { FieldValidationException, Headers } from '@lyvely/common';

@Injectable()
export class CaptchaGuard implements CanActivate {
  constructor(private captchaService: CaptchaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const input = request.header(Headers.X_CAPTCHA_TOKEN);
    const identity = request.header(Headers.X_CAPTCHA_ID);

    if (!input || !identity) {
      throw new BadRequestException();
    }

    if (!(await this.captchaService.runValidation(identity, input))) {
      throw new FieldValidationException([{ property: 'captcha', errors: ['isValid'] }]);
    }

    return true;
  }
}
