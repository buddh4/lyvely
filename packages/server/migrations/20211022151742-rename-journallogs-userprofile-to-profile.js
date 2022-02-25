module.exports = {
  async up(db, client) {
    await db
      .collection('journallogs')
      .updateMany({}, { $rename: { userProfile: 'profile' } });
  },

  async down(db, client) {
    await db
      .collection('journallogs')
      .updateMany({}, { $rename: { profile: 'userProfile' } });
  },
};
