const { getObjectId } = require('mongo-seeding');

module.exports = {
  _id: getObjectId('Jan-profile'),
  oid: getObjectId('Jan-profile-oid'),
  owner: getObjectId('Jan'),
  handle: 'Jan',
  locale: 'en-US',
  usage: ['Private'],
  archived: false,
  visibility: 0,
  hasOrg: false,
  name: 'Jan',
  score: 0,
  type: 'UserProfile',
  categories: [],
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
