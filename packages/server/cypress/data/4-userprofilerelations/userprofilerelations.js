const { getObjectId } = require("mongo-seeding");

module.exports = {
    _id: getObjectId('Jan-profile-relation'),
    uid: getObjectId('Jan'),
    pid: getObjectId('Jan-profile'),
    type: 'Membership',
    role: 'owner',
}