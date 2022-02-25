module.exports = {
  async up(db, client) {
    await db
      .collection('habitlogs')
      .updateMany({}, { $rename: { uot: 'timing' } });
  },

  async down(db, client) {
    await db
      .collection('habitlogs')
      .updateMany({}, { $rename: { timing: 'uot' } });
  },
};
