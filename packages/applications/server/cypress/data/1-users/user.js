const { getObjectId } = require('mongo-seeding');

module.exports = {
  _id: getObjectId('Jan'),
  username: 'Jan',
  password: '$2a$12$n3wKMI9QyBOaA7kr9XtvlOTb5n61vG.OF2JPfu5H2FcugYIqDBWMW',
  email: 'jan@test.com',
  locale: 'de-DE',
  enabled: true,
};
