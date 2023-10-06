import { Type } from '../../utils';
export type DefaultValue<TValue> = TValue | (() => TValue);
export interface IPropertyDefinitionOption<TValue> {
    default?: DefaultValue<TValue>;
    optional?: boolean;
}
export interface IPropertyDefinition<TTarget = any, TValue = any> extends IPropertyDefinitionOption<TValue> {
    type: TTarget;
}
export declare function getPropertyTypeDefinitions(type: Type): Record<string, IPropertyDefinition>;
export declare function getPropertyTypeDefinition(type: Type, propertyKey: string): IPropertyDefinition<any, any>;
export declare function PropertyType<TTarget extends Object, TProperty extends Extract<keyof TTarget, string>, TValue = TTarget[TProperty]>(type: Type<TValue> | Array<Type<TValue>> | null | undefined, options?: IPropertyDefinitionOption<TValue>): PropertyDecorator;
