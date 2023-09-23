"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelValidator = void 0;
const class_validator_1 = require("class-validator");
class ModelValidator {
    constructor(model, options) {
        this.options = options || {};
        this.errors = {};
        this.options.rules = this.options.rules || {};
        this.model = model;
        if (!this.options.isFieldValidator) {
            this.fieldValidator = new ModelValidator(model, Object.assign({}, options, { isFieldValidator: true }));
        }
    }
    addRule(property, validator) {
        if (!this.options.rules[property]) {
            this.options.rules[property] = [validator];
        }
        else {
            this.options.rules[property].push(validator);
        }
    }
    setModel(model) {
        this.reset();
        this.model = model;
        this.fieldValidator?.setModel(model);
    }
    hasErrors() {
        return !!this.getErrorSummary().length;
    }
    reset() {
        this.errors = {};
    }
    getErrorSummary() {
        return Object.values(this.errors);
    }
    getValidationResult() {
        return Object.keys(this.errors).map((property) => ({
            property: property,
            errors: [this.errors[property]],
        }));
    }
    setErrors(errors) {
        for (const error of errors) {
            if (error.errors?.length) {
                this.errors[error.property] = error.errors[0];
            }
        }
    }
    getError(field) {
        return this.errors[field];
    }
    async validate(options = {}) {
        if (!this.model)
            return false;
        options.forbidUnknownValues = options.forbidUnknownValues !== false;
        options.validationError = { target: true, value: true };
        this.setValidationErrors(await (0, class_validator_1.validate)(this.model, options));
        await this.validateRules(options);
        return !this.hasErrors();
    }
    async validateRules(options = {}) {
        if (!this.model)
            return false;
        for (const property of Object.keys(this.options.rules)) {
            if (options.validationField && options.validationField !== property)
                continue;
            if (this.getError(property))
                continue;
            const propRules = this.options.rules[property] || [];
            for (const rule of propRules) {
                const injectedResult = { property, errors: [] };
                const result = (await rule(this.model[property], injectedResult)) || injectedResult;
                if (result.errors?.length) {
                    this.errors[property] = result.errors[0];
                    break;
                }
            }
        }
    }
    setValidationErrors(errors) {
        this.reset();
        if (!errors?.length)
            return;
        for (const error of errors) {
            this.setFirstError(error);
        }
    }
    setFirstError(error) {
        const constraints = error.constraints;
        const rules = Object.keys(constraints);
        if (!rules.length)
            return;
        const firstRule = constraints?.isNotEmpty
            ? 'isNotEmpty'
            : constraints?.isDefined
                ? 'isDefined'
                : rules[0];
        const firstErrorMessage = constraints[firstRule];
        if (firstErrorMessage) {
            this.errors[error.property] = this.options.translate
                ? this.options.translate({
                    model: error.target,
                    value: error.value,
                    property: error.property,
                    message: firstErrorMessage,
                    rule: firstRule,
                    context: error.contexts,
                }) || firstErrorMessage
                : firstErrorMessage;
        }
    }
    async validateField(field, options) {
        if (this.options.isFieldValidator || !this.fieldValidator) {
            throw new Error('Call of validateField is not supported for this validator type');
        }
        options = options || {};
        options.validationField = field;
        await this.fieldValidator.validate(options);
        const error = this.fieldValidator.getError(field);
        if (error) {
            this.errors[field] = error;
        }
        else {
            delete this.errors[field];
        }
        this.fieldValidator.reset();
        return typeof error !== 'string';
    }
}
exports.ModelValidator = ModelValidator;
