import { IPolicy } from '../interfaces';

/**
 * A helper policy which will automatically grant all verification requests.
 */
export class GrantAllPolicy implements IPolicy<any> {
  async verify(context: any): Promise<boolean> {
    return true;
  }
}
