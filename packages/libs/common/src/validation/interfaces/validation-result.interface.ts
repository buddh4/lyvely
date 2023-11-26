export interface IFieldValidationResult {
  property: string;
  errors?: string[];
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
