import { Injectable } from '@nestjs/common';
import { AbstractContentGuard } from './abstract-content.guard';

@Injectable()
export class ContentGuard extends AbstractContentGuard {
  async canActivateContent() {
    return true;
  }

  isContentRequired(): boolean {
    return false;
  }
}
