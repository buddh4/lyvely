import { IPolicy } from '../interfaces';

/**
 * A helper policy which will automatically decline all verification requests.
 * This may be used in cases where a certain feature is not supported.
 */
export class DeclineAllPolicy implements IPolicy<any> {
  async verify(context: any): Promise<boolean> {
    return false;
  }
}
