import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_RESET_PASSWORD_TOKEN } from '@/auth/guards/strategies/jwt-reset-password.strategy';

@Injectable()
export class JwtResetPasswordGuard extends AuthGuard(JWT_RESET_PASSWORD_TOKEN) {}
