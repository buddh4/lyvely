module.exports = {
  async up(db, client) {
    await db
      .collection('userprofiles')
      .updateMany({}, { $rename: { user: 'owner' } });
  },

  async down(db, client) {
    await db
      .collection('userprofiles')
      .updateMany({}, { $rename: { user: 'owner' } });
  },
};
