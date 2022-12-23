import { Injectable } from '@nestjs/common';
import { ContentPolicy } from './content.policy';

@Injectable()
export class ContentReadPolicy extends ContentPolicy {
  async validate(context): Promise<boolean> {
    // TODO: GUEST mode feature
    // TODO: Profile visibility check
    return !!context.getRequest()?.context?.getMembership();
  }
}
