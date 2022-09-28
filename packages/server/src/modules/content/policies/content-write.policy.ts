import { Injectable } from '@nestjs/common';
import { ContentPolicy } from './content.policy';

@Injectable()
export class ContentWritePolicy extends ContentPolicy {
  async validate(context): Promise<boolean> {
    // TODO: Profile permission check
    return !!context.getRequest()?.profileRelations?.getMembership();
  }
}
