const { getObjectId } = require('mongo-seeding');
const { createHash } = require('crypto');

const createUserData = (username, options) => {
  options ??= {};
  return {
    _id: getObjectId(username),
    username: username,
    displayName: options.displayName || username,
    // TestPassword123
    password: options.password || '$2b$10$dAFtho9KZlHjvkQ3IDEK8.zY6xasozqQC8agu5ICMqIXeVLCWQx3W',
    status: options.status ?? 1, // Enabled by default
    email: options.email || username.toLowerCase() + '@test.com',
    guid: createHash('md5').update(username).digest('hex'),
    emails: options.emails || [
      { email: options.email || username.toLowerCase() + '@test.com', verified: true },
    ],
    locale: options.locale || 'en-US',
    timezone: options.timezone || 'America/Los_Angeles',
  };
};

module.exports = [
  createUserData('owner'),
  createUserData('member'),
  createUserData('moderator'),
  createUserData('no-member'),
  createUserData('disabled', { status: 0 }),
];
