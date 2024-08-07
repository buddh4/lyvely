const { getObjectId } = require('mongo-seeding');
const { createHash } = require('crypto');

const createProfileRelationData = (userSeed, profileSeed, options) => {
  options ??= {};
  return {
    _id: getObjectId(userSeed + profileSeed + '-relation'),
    uid: getObjectId(userSeed),
    pid: getObjectId(profileSeed),
    type: options.type || 'Membership',
    role: options.role || 'member',
    userInfo: {
      displayName: options.displayName || userSeed,
      guid: createHash('md5')
        .update(userSeed + profileSeed + '-relation')
        .digest('hex'),
      email: options.email || userSeed.toLowerCase() + '@test.com',
    },
  };
};

module.exports = [
  createProfileRelationData('owner', 'owner-profile', { role: 'owner' }),
  createProfileRelationData('owner', 'public-group', { role: 'owner' }),
  createProfileRelationData('owner', 'private-group', { role: 'owner' }),
  createProfileRelationData('owner', 'protected-group', { role: 'owner' }),
  createProfileRelationData('owner', 'archived-group', { role: 'owner' }),

  createProfileRelationData('admin', 'admin-profile', { role: 'admin' }),
  createProfileRelationData('admin', 'public-group', { role: 'admin' }),
  createProfileRelationData('admin', 'private-group', { role: 'admin' }),
  createProfileRelationData('admin', 'protected-group', { role: 'admin' }),
  createProfileRelationData('admin', 'archived-group', { role: 'admin' }),

  createProfileRelationData('member', 'private-group'),
  createProfileRelationData('member', 'public-group'),
  createProfileRelationData('member', 'protected-group'),
  createProfileRelationData('member', 'public-organization'),
  createProfileRelationData('member', 'archived-group'),

  createProfileRelationData('moderator', 'private-group', {
    role: 'moderator',
  }),
  createProfileRelationData('moderator', 'public-group', { role: 'moderator' }),
  createProfileRelationData('moderator', 'protected-group', {
    role: 'moderator',
  }),
  createProfileRelationData('moderator', 'public-organization', {
    role: 'moderator',
  }),
  createProfileRelationData('moderator', 'archived-group', {
    role: 'moderator',
  }),
];
