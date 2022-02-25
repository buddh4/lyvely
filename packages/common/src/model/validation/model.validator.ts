import { validate, ValidationError } from 'class-validator';
type ValidationErrors = Record<string, string|boolean>;

export class ModelValidator {
  private errors = {} as ValidationErrors;
  private errorArr = [] as ValidationError[];
  private model: object;

  constructor(model: object = {}) {
    this.model = model;
  }

  setModel(model: object) {
    this.reset();
    this.model = model;
  }

  hasErrors(): boolean {
    return !!this.errorArr.length;
  }

  reset() {
    this.errors = {};
    this.errorArr = [];
  }

  getError(field: string) {
    return this.errors[field];
  }

  async validate(): Promise<boolean> {
    this.reset();

    this.errorArr = await validate(this.model);

    for (const error of this.errorArr) {
      const constraints = error.constraints as Record<string, string>;

      const firstError =
        constraints?.isNotEmpty ||
        constraints?.isDefined ||
        constraints[Object.keys(constraints)[0]];

      if (firstError) {
        this.errors[error.property] = firstError;
      }
    }

    return !this.hasErrors();
  }
}