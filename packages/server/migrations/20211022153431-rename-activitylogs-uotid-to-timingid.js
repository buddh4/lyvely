module.exports = {
  async up(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { uotId: 'timingId' } });
  },

  async down(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { timingId: 'uotId' } });
  },
};
