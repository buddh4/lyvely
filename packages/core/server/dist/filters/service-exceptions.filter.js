"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ServiceExceptionsFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@lyvely/common");
let ServiceExceptionsFilter = exports.ServiceExceptionsFilter = ServiceExceptionsFilter_1 = class ServiceExceptionsFilter {
    constructor() {
        this.logger = new common_1.Logger(ServiceExceptionsFilter_1.name);
    }
    catch(exception, host) {
        this.logger.error(exception.message, exception.stack);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const responseData = exception.getResponse();
        const status = exception.status;
        if (!responseData) {
            response.status(status).json({
                statusCode: status,
                message: exception.message,
                error: exception.message,
            });
        }
        else if (typeof responseData === 'string') {
            response.status(status).json({
                statusCode: status,
                message: responseData,
                error: responseData,
            });
        }
        else {
            response.status(status).json(responseData);
        }
    }
};
exports.ServiceExceptionsFilter = ServiceExceptionsFilter = ServiceExceptionsFilter_1 = __decorate([
    (0, common_1.Catch)(common_2.ServiceException)
], ServiceExceptionsFilter);
