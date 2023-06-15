"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedSchema = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const NestedSchema = (options) => (0, mongoose_1.Schema)(Object.assign({ _id: false }, options));
exports.NestedSchema = NestedSchema;
