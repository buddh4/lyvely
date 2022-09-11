import { createUserAuthor } from '../src/modules/content';
import crypto from 'crypto';

module.exports = {
  async up(db, client) {
    const contents = await db.collection('contents').find({}, { projection: { createdBy: 1, createdAs: 1 } });

    while(await contents.hasNext()) {
      const content = await contents.next();

      if (contents.createdAs) {
        continue;
      }

      const user = await db.collection('users').findOne({ _id: content.createdBy });

      if(!user) {
        continue;
      }

      user.getDisplayName = () => user.name;
      user.getImageHash = () => crypto.createHash('md5').update(user.email.toLowerCase()).digest('hex');

      const createdAs = createUserAuthor(user);

      console.log(`Addin createdAs to content: ${content._id}`);

      await db.collection('contents').updateOne({ _id: content._id }, { $set: { createdAs: createdAs } });
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
