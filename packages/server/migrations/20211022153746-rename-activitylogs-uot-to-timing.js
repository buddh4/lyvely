module.exports = {
  async up(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { uot: 'timing' } });
  },

  async down(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { timing: 'uot' } });
  },
};
