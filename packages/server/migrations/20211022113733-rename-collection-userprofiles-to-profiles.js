module.exports = {
  async up(db, client) {
    await db.collection('userprofiles').rename('profiles', { dropTarget: true });
  },

  async down(db, client) {
    await db.collection('profiles').rename('userprofiles');
  },
};
