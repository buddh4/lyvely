const { getObjectId } = require('mongo-seeding');
const { RoleVisibilityLevel } = require('@lyvely/interface');

module.exports = [
  {
    _id: getObjectId('jan-profile-message1'),
    pid: getObjectId('jan-profile'),
    oid: getObjectId('jan-profile-oid'),
    location: 'default',
    content: {
      text: 'First profile message!',
    },
    meta: {
      createdBy: getObjectId('Jan'),
      updatedBy: getObjectId('Jan'),
      streamSort: Date.now(),
      visibility: RoleVisibilityLevel.Member,
      createdAt: new Date(),
      updatedAt: new Date(),
      childCount: 0,
    },
    type: 'Message',
  },
];
