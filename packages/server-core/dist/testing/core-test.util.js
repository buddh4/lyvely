"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectId = exports.createCoreTestingModule = exports.closeInMongodConnections = exports.closeInMongodConnection = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const config_1 = require("@nestjs/config");
const testing_1 = require("@nestjs/testing");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_2 = require("mongoose");
const mongo_seeding_1 = require("mongo-seeding");
const mongods = new Map();
const closeInMongodConnection = async (key) => {
    if (mongods.get(key))
        await mongods.get(key).stop();
    await (0, mongoose_2.disconnect)();
};
exports.closeInMongodConnection = closeInMongodConnection;
const closeInMongodConnections = async () => {
    for (const value of mongods.values()) {
        await value.stop();
    }
    await (0, mongoose_2.disconnect)();
};
exports.closeInMongodConnections = closeInMongodConnections;
function createCoreTestingModule(key, providers = [], models = [], imports = [], config = {}) {
    return testing_1.Test.createTestingModule({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async () => {
                    const mongod = await mongodb_memory_server_1.MongoMemoryServer.create();
                    const mongoUri = mongod.getUri();
                    mongods.set(key || new Date().toString(), mongod);
                    return {
                        uri: mongoUri,
                    };
                },
            }),
            mongoose_1.MongooseModule.forFeature([...models]),
            event_emitter_1.EventEmitterModule.forRoot({ wildcard: true }),
            config_1.ConfigModule.forRoot({
                load: [
                    () => Promise.resolve().then(() => require('./lyvely-test.config')).then((module) => module.default),
                    () => Promise.resolve(config),
                ],
                isGlobal: true,
            }),
            ...imports,
        ],
        providers: [...providers],
    });
}
exports.createCoreTestingModule = createCoreTestingModule;
function getObjectId(id) {
    return new mongoose_2.default.Types.ObjectId((0, mongo_seeding_1.getObjectId)(id).toString());
}
exports.getObjectId = getObjectId;
