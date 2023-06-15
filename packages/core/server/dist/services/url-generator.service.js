"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlGenerator = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const common_2 = require("@lyvely/common");
let UrlGenerator = exports.UrlGenerator = class UrlGenerator {
    constructor(configService) {
        this.configService = configService;
    }
    getAppUrl(route) {
        return this.generateUrl(this.getBaseAppUrl(), route);
    }
    getApiUrl(route) {
        return this.generateUrl(this.getBaseApiUrl(), route);
    }
    generateUrl(baseUrl, route) {
        const url = new URL(baseUrl);
        url.pathname += this.getPathString(route?.path);
        if (route?.query) {
            Object.keys(route.query).forEach((name) => url.searchParams.append(name, route.query[name]));
        }
        return url;
    }
    getPathString(path) {
        if (!path)
            return '';
        return path.startsWith('/') ? path.substring(1, path.length) : path;
    }
    getBaseApiUrl() {
        const appUrl = this.configService.get('http.baseUrl');
        if (!appUrl) {
            throw new common_2.MisconfigurationException('Could not generate app url, no http.appUrl setting configured');
        }
        return appUrl.endsWith('/') ? appUrl : appUrl + '/';
    }
    getBaseAppUrl() {
        const appUrl = this.configService.get('http.appUrl');
        if (!appUrl) {
            throw new common_2.MisconfigurationException('Could not generate app url, no http.appUrl setting configured');
        }
        return appUrl.endsWith('/') ? appUrl : appUrl + '/';
    }
};
exports.UrlGenerator = UrlGenerator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UrlGenerator);
