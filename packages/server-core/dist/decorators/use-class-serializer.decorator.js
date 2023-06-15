"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseClassSerializer = void 0;
const common_1 = require("@nestjs/common");
const UseClassSerializer = () => (0, common_1.UseInterceptors)(common_1.ClassSerializerInterceptor);
exports.UseClassSerializer = UseClassSerializer;
