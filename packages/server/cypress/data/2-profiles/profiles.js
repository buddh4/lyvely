const { getObjectId } = require("mongo-seeding");

module.exports = {
    _id: getObjectId('Jan-profile'),
    name: "default",
    score: 0,
    owner: getObjectId('Jan'),
    type: 0, // private
    categories: []
}