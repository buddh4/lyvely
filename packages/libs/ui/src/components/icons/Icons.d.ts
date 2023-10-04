export interface IconDefinitionIF {
    name: string;
    alias?: string[];
    viewBox: string;
    paths: string[];
}
export declare const Icons: {
    [n: string]: IconDefinitionIF;
};
export type IconName = keyof typeof Icons & string;
export declare function getIconByName(name: IconName): IconDefinitionIF | undefined;
