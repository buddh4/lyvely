export interface IFieldValidationResult {
  property: string;
  errors?: string[];
}

export interface IModelValidationResult {
  model: string;
  fields: IFieldValidationResult[];
}
