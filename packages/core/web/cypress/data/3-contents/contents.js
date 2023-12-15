const { getObjectId } = require('mongo-seeding');
const { RoleVisibilityLevel } = require('@lyvely/interface');

const createMessage = (idSeed, authorSeed, profileSeed, text, options) => {
  options ||= {};
  return {
    _id: getObjectId(idSeed),
    pid: getObjectId(profileSeed),
    oid: getObjectId(profileSeed + '-oid'),
    location: 'default',
    content: { text },
    meta: {
      createdBy: getObjectId(authorSeed),
      updatedBy: getObjectId('authorSeed'),
      streamSort: options.streamSort ?? Date.now(),
      visibility: options.visibility || RoleVisibilityLevel.Member,
      createdAt: new Date(),
      updatedAt: new Date(),
      childCount: options.childCount ?? 0,
      archived: options.archived ?? false,
      deleted: options.deleted ?? false,
      locked: options.locked ?? false,
    },
    tagIds: options.tagIds || [],
    type: 'Message',
  };
};

module.exports = [
  createMessage('owner-profile-first', 'owner', 'owner-profile', 'First profile message!', {
    streamSort: 1702640598017,
  }),

  createMessage('owner-profile-archived', 'owner', 'owner-profile', 'Archived message', {
    streamSort: 1702640598018,
    archived: true,
  }),
  createMessage('owner-profile-deleted', 'owner', 'owner-profile', 'Deleted message', {
    streamSort: 1702640598019,
    deleted: true,
  }),
  createMessage('owner-profile-locked', 'owner', 'owner-profile', 'Locked message', {
    streamSort: 1702640598020,
    locked: true,
  }),
  createMessage('owner-profile-tagged', 'owner', 'owner-profile', 'Healthy!', {
    tagIds: [getObjectId('tag-health')],
    streamSort: 1702640598021,
  }),
];
