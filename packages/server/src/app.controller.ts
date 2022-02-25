import { Controller } from '@nestjs/common';
import { AuthService } from './auth/services/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
}
