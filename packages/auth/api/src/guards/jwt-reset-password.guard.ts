import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_RESET_PASSWORD_TOKEN } from '@lyvely/auth';

@Injectable()
export class JwtResetPasswordGuard extends AuthGuard(JWT_RESET_PASSWORD_TOKEN) {}
