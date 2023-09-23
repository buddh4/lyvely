"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformObjectId = void 0;
const class_transformer_1 = require("class-transformer");
const TransformObjectId = () => (0, class_transformer_1.Transform)(({ value, obj }) => (value && 'toString' in value ? value.toString() : value));
exports.TransformObjectId = TransformObjectId;
