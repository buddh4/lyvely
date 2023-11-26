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
  tags: [
    {
      _id: getObjectId('tag-health'),
      name: 'Health',
      description: 'Keep a healthy lifestyle',
      color: '#CE0DD8',
    },
    {
      _id: getObjectId('tag-education'),
      name: 'Education',
      description: 'Keep your brain up to date',
      color: '#019374',
    },
    {
      _id: getObjectId('tag-social'),
      name: 'Social',
      description: 'Socialize!',
      archived: true,
      color: '#019374',
    },
  ],
  name: 'Jan',
  score: 0,
  type: 'UserProfile',
  categories: [],
  permissions: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};
