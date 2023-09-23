"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTo = void 0;
const class_transformer_1 = require("class-transformer");
const TransformTo = (type) => (0, class_transformer_1.Type)(() => type);
exports.TransformTo = TransformTo;
