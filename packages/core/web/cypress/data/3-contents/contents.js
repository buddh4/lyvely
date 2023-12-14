const { getObjectId } = require('mongo-seeding');
const { RoleVisibilityLevel } = require('@lyvely/interface');

const createMessage = (idSeed, authorSeed, profileSeed, text, options) => {
  return {
    _id: getObjectId(idSeed),
    pid: getObjectId(profileSeed),
    oid: getObjectId(profileSeed + '-oid'),
    location: 'default',
    content: { text },
    meta: {
      createdBy: getObjectId(authorSeed),
      updatedBy: getObjectId('authorSeed'),
      streamSort: Date.now(),
      visibility: options.visibility || RoleVisibilityLevel.Member,
      createdAt: new Date(),
      updatedAt: new Date(),
      childCount: options.childCount ?? 0,
      archived: options.archived ?? false,
      deleted: options.deleted ?? false,
      locked: options.locked ?? false,
    },
    type: 'Message',
  };
};

module.exports = [
  createMessage('owner-profile-archived', 'owner', 'owner-profile', 'First profile message!', {
    archived: true,
  }),
];
