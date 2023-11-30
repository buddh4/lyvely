const { getObjectId } = require('mongo-seeding');
const { createHash } = require('crypto');
const slugify = require('slugify');

const createProfile = (idSeed, ownerSeed, options) => {
  options ??= {};
  return {
    _id: getObjectId(idSeed),
    oid: options.oid || getObjectId(idSeed + '-oid'),
    ownerId: getObjectId(ownerSeed),
    name: options.name || idSeed,
    handle: options.handle || slugify(idSeed),
    guid: createHash('md5').update(idSeed).digest('hex'),
    locale: options.locale || 'en-US',
    usage: options.usage || [],
    archived: options.usage ?? false,
    deleted: options.deleted ?? false,
    visibility: options.visibility ?? 0,
    hasOrg: options.hasOrg ?? false,
    tags: options.tags || [],
    score: options.score ?? 0,
    type: options.type || 'user',
    permissions: options.permissions || [],
    settings: options.settings || {},
    enabledFeatures: options.enabledFeatures || [],
    disabledFeatures: options.disabledFeatures || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

module.exports = [
  createProfile('jan-profile', 'Jan', {
    usage: ['Private'],
    type: 'user',
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
  }),
  createProfile('member-group', 'Jan', {
    usage: ['Project'],
    name: 'Member Group',
    type: 'group',
    visibility: 2, // All authenticated users
    tags: [
      {
        _id: getObjectId('tag-bugs'),
        name: 'Bugs',
        description: 'Used for bug tracking',
        type: 'group',
        color: '#CE0DD8',
      },
    ],
  }),
  createProfile('public-group', 'Jan', {
    usage: ['Project'],
    name: 'Public Group',
    type: 'group',
    visibility: 3, // All users including visitors
    tags: [
      {
        _id: getObjectId('tag-bugs'),
        name: 'Support',
        description: 'Support issues',
        color: '#CE0DD8',
      },
    ],
  }),
  createProfile('public-organization', 'Jan', {
    usage: ['Business'],
    name: 'Public Organization',
    type: 'organization',
    visibility: 3, // All users including visitors
    tags: [
      {
        _id: getObjectId('tag-bugs'),
        name: 'Support',
        description: 'Support issues',
        type: 'group',
        color: '#CE0DD8',
      },
    ],
  }),
  createProfile('organization-member-group', 'Jan', {
    usage: ['Project'],
    oid: getObjectId('public-organization'),
    name: 'Organization Member Group',
    type: 'group',
    hasOrg: true,
    visibility: 1, // Organization only
    tags: [
      {
        _id: getObjectId('tag-bugs'),
        name: 'Support',
        description: 'Support issues',
        type: 'group',
        color: '#CE0DD8',
      },
    ],
  }),
];
