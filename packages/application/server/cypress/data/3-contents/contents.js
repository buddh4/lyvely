const { getObjectId } = require('mongo-seeding');

module.exports = [
  {
    uid: getObjectId('Jan'),
    pid: getObjectId('Jan-profile'),
    title: 'Test Habit',
    description: 'A Test Habit',
    plan: 5,
    rating: {
      value: 2,
      optimal: 3,
      min: 2,
      max: 5,
    },
    archived: false,
    categories: [],
    type: 'Habit',
  },
  {
    uid: getObjectId('Jan'),
    pid: getObjectId('Jan-profile'),
    title: 'Archived Habit',
    description: 'An Archived Test Habit',
    plan: 5,
    rating: {
      value: 2,
      optimal: 3,
      min: 2,
      max: 5,
    },
    archived: true,
    categories: [],
    type: 'Habit',
  },
];
