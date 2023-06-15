"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const lyvelyTestConfig = {
    appName: 'lyvely.test.app',
    operationMode: config_1.OperationMode.STANDALONE,
    docUrl: 'http://docs.lyvely.app',
    contactMail: 'test@test.de',
    http: {
        baseUrl: 'https://api.test.com',
        host: 'localhost',
        port: 8080,
        appUrl: 'https://test.com',
    },
    redis: {
        host: '0.0.0.0',
        port: 6379,
    },
    auth: {
        jwt: {
            'secure-cookies': false,
            access: {
                secret: 'e5d2ece45d3b7919fc7b6a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
                expiresIn: '15m',
                sameSite: 'lax',
            },
            refresh: {
                secret: 'e5d2ece45d3b7919fc7b7a8f19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
                expiresIn: '30m',
                expiresInRemember: '200d',
                sameSite: 'lax',
            },
            verify: {
                secret: 'e5d2ece45d3b7919fc7b7aff19abc0cb7916c71bef385ca11f27a0a3b324e3d2',
                expiresIn: '1d',
            },
        },
    },
    mail: {
        createMessageFiles: true,
        messagesPath: `${process.cwd()}/mail/messages/test`,
        transport: {
            jsonTransport: true,
        },
        defaults: {
            from: '"No Reply" <no-reply@test>',
        },
        preview: false,
        template: {
            options: {
                strict: true,
            },
        },
    },
};
exports.default = lyvelyTestConfig;
