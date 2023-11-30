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
  createProfileRelationData('Jan', 'jan-profile', { role: 'owner' }),
  createProfileRelationData('Jan', 'member-group', { role: 'owner' }),
  createProfileRelationData('Peter', 'member-group'),
  createProfileRelationData('Peter', 'public-organization'),
];
