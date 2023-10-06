import { Type } from '../../utils';
type WithTransformation = ((any: any, string: any) => undefined | any) | undefined;
interface IAssignOptions {
    maxDepth?: number;
    strict?: boolean;
    transform?: WithTransformation;
}
export declare function createAndAssign<T, C extends Type<T> = Type<T>>(type: C, data?: {
    [key in keyof T]?: any;
} & any, options?: IAssignOptions): any;
export declare function assignRawDataToAndInitProps<T extends Object>(model: T, data?: {
    [key in keyof T]?: any;
} & any, options?: IAssignOptions): T;
export declare function assignRawDataTo<T extends Object>(model: T, data: {
    [key in keyof T]?: any;
} & any, { maxDepth, strict, transform }?: {
    maxDepth?: number;
    strict?: boolean;
    transform?: (any: any, string: any) => any;
}): T;
export {};
