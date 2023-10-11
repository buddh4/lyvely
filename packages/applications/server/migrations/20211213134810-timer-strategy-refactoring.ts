module.exports = {
  async up(db, client) {
    await db.collection('contents');
    db.contents.updateMany(
      { 'config.timeSeries.strategy': 'number_time' },
      {
        $set: {
          'config.timeSeries.strategy': 'timer_timer',
        },
      },
    );
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
