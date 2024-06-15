import { AbstractDao, DocumentIdentity, Dao } from '@/core';
import { UserOtp } from '../schemas';

/**
 * UserOtpDao is a class that provides CRUD operations for the UserOtp model.
 *
 * @extends AbstractDao
 */
@Dao(UserOtp)
export class UserOtpDao extends AbstractDao<UserOtp> {
  /**
   * Increments the number of attempts for a given OTP.
   *
   * @param {DocumentIdentity<UserOtp>} identity - The identity of the user OTP document.
   *
   * @return {Promise<Document<UserOtp> | null>} A promise that resolves to the updated user OTP document or null if not found.
   */
  async incrementAttempt(identity: DocumentIdentity<UserOtp>): Promise<boolean> {
    return this.updateOneById(identity, { $inc: { attempts: 1 } });
  }
}
