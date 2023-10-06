import { IUrlRoute } from '../interfaces';
export declare class UrlRoute implements IUrlRoute {
    path?: string;
    query?: Record<string, string>;
    pid?: string;
}
