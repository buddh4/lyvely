module.exports = {
  async up(db, client) {
    await db
      .collection('contents')
      .updateMany({}, { $rename: { userProfile: 'profile' } });
  },

  async down(db, client) {
    await db
      .collection('contents')
      .updateMany({}, { $rename: { profile: 'userProfile' } });
  },
};
