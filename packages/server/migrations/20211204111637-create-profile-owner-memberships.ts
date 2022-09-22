import { Db } from 'mongodb'
import { ProfileDocument, Profile , Membership, MembershipDocument } from '../src/modules/profiles';
import { BaseMembershipRole, BaseUserProfileRelationType } from '@lyvely/common';

module.exports = {
  async up(db: Db) {
    // @ts-ignore
    const profiles = await db.collection<ProfileDocument>('profiles').find({}, { projection: { owner: 1 } });

    while(await profiles.hasNext()) {
      const profile = await profiles.next() as Profile & {owner ?: TObjectId};

      if(!profile.owner) {
        continue;
      }

      const membership: Partial<Membership> = {
        uid: profile.owner,
        pid: profile._id,
        type: BaseUserProfileRelationType.Membership,
        role: BaseMembershipRole.Owner,
      }

      console.log(`Upserting owner membership of profile: ${profile._id}`);

      await db.collection<MembershipDocument>('userprofilerelations')
        .updateOne(membership, { $set: membership }, { upsert: true })
    }
  },

  async down(db: Db) {
    // Can not be reverted
  }
};
