module.exports = {
  async up(db, client) {
    await db
      .collection('journallogs')
      .updateMany({}, { $rename: { uot: 'timing' } });
  },

  async down(db, client) {
    await db
      .collection('journallogs')
      .updateMany({}, { $rename: { timing: 'uot' } });
  },
};
