module.exports = {
  async up(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { value: 'score' } });
  },

  async down(db, client) {
    await db
      .collection('activitylogs')
      .updateMany({}, { $rename: { score: 'value' } });
  },
};
