"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectIdProp = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ObjectIdProp = (options) => (0, mongoose_1.Prop)(Object.assign({ type: mongoose_2.default.Schema.Types.ObjectId }, options));
exports.ObjectIdProp = ObjectIdProp;
