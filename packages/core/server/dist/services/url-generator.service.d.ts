import { ConfigService } from '@nestjs/config';
import { ConfigurationPath } from '../config';
import { UrlRoute } from '@lyvely/common';
export declare class UrlGenerator {
    protected readonly configService: ConfigService<ConfigurationPath>;
    constructor(configService: ConfigService<ConfigurationPath>);
    getAppUrl(route?: UrlRoute): URL;
    getApiUrl(route?: UrlRoute): URL;
    protected generateUrl(baseUrl: string, route?: UrlRoute): URL;
    protected getPathString(path?: string): string;
    protected getBaseApiUrl(): any;
    protected getBaseAppUrl(): any;
}
