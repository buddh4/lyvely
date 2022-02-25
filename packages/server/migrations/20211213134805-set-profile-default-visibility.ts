module.exports = {
  async up(db, client) {
    await db
      .collection('profiles')
      .updateMany({visibility: { $exists: false} }, { $set: { visibility: 0 } }); // ProfileVisibility.Member
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
