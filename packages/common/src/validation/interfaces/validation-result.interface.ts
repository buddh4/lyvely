export enum FieldValidationErrorFlags {
  Unique = 'unique',
}
export interface IFieldValidationResult {
  property: string;
  errors?: string[];
  flags?: FieldValidationErrorFlags[];
}

export interface IFieldValidationResponse {
  fields: IFieldValidationResult[];
}

export interface IModelValidationResult {
  model: string;
  fields: IFieldValidationResult[];
}

export interface IModelValidationResponse {
  result: IModelValidationResult[];
}
