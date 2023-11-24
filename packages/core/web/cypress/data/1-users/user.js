const { getObjectId } = require('mongo-seeding');

module.exports = [
  {
    _id: getObjectId('Jan'),
    username: 'Jan',
    displayName: 'Jan Tester',
    password: '$2b$10$dAFtho9KZlHjvkQ3IDEK8.zY6xasozqQC8agu5ICMqIXeVLCWQx3W',
    status: 1,
    email: 'jan@test.com',
    guid: '82755e5b7b5e0b39a3cec18092b8ddf6121bf5abdc7bbcfd4ce7abc3669ca870',
    emails: [{ email: 'jan@test.com', verified: true }],
    locale: 'en-US',
    timezone: 'America/Los_Angeles',
  },
  {
    _id: getObjectId('Disabled'),
    username: 'Disabled',
    displayName: 'Disabled Tester',
    password: '$2b$10$dAFtho9KZlHjvkQ3IDEK8.zY6xasozqQC8agu5ICMqIXeVLCWQx3W',
    status: 0,
    email: 'disabled@test.com',
    guid: '82755e5b7b5e0b39a3cec18092b8ddf6121bf5abdc7bbcfd4ce7abc3669ca871',
    emails: [{ email: 'disabled@test.com', verified: true }],
    locale: 'en-US',
    timezone: 'America/Los_Angeles',
  },
];
