export interface IModuleMetaOptions {
    id: string;
    path: string;
    name: string;
    description: string;
}
export declare class ModuleMeta {
    private id;
    private path;
    private name;
    private description?;
    constructor(data: IModuleMetaOptions);
    getId(): string;
    getPath(): string;
    buildPath(path: string): string;
    getName(): string;
}
