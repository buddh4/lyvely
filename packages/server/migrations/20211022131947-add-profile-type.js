module.exports = {
  async up(db, client) {
    await db.collection('profiles').updateMany({}, {$set: {"type": 0}});
  },

  async down(db, client) {
    // NOT Downgradable
  },
};
