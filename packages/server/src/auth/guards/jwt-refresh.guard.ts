import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JWT_REFRESH_TOKEN } from '@/auth/guards/strategies';

@Injectable()
export class JwtRefreshGuard extends AuthGuard(JWT_REFRESH_TOKEN) {}
