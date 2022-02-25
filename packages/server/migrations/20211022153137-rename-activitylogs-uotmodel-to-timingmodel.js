module.exports = {
  async up(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { uotModel: 'timingModel' } });
  },

  async down(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { timingModel: 'uotModel' } });
  },
};
