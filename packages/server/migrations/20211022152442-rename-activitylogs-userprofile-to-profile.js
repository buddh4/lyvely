module.exports = {
  async up(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { userProfile: 'profile' } });
  },

  async down(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { profile: 'userProfile' } });
  },
};
