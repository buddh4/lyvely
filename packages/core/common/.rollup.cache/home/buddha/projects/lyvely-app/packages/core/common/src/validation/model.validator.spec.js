import { __decorate, __metadata } from "tslib";
import { IsNumber, IsString } from 'class-validator';
import { ModelValidator } from './model.validator';
class TestIdModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], TestIdModel.prototype, "someNumber", void 0);
class MultiFieldModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], MultiFieldModel.prototype, "someNumber", void 0);
__decorate([
    IsString(),
    __metadata("design:type", String)
], MultiFieldModel.prototype, "someString", void 0);
describe('ModelValidator', () => {
    describe('validate', function () {
        it('test validation fails', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            expect(await validator.validate()).toEqual(false);
        });
        it('test validation succeeds', async () => {
            const validator = new ModelValidator(new TestIdModel({ someNumber: 3 }));
            expect(await validator.validate()).toEqual(true);
        });
        it('fix validation', async () => {
            const model = new MultiFieldModel({ someNumber: 3 });
            const validator = new ModelValidator(model);
            expect(await validator.validate()).toEqual(false);
            model.someString = 'value';
            expect(await validator.validate()).toEqual(true);
        });
    });
    describe('hasErrors', function () {
        it('test model does not have error prior validate', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            expect(validator.hasErrors()).toEqual(false);
        });
        it('test model does have error after validate', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            await validator.validate();
            expect(validator.hasErrors()).toEqual(true);
        });
        it('test model does have error after validate', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            await validator.validate();
            expect(validator.hasErrors()).toEqual(true);
        });
    });
    describe('reset', function () {
        it('test model does not have error after reset', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            await validator.validate();
            validator.reset();
            expect(validator.hasErrors()).toEqual(false);
        });
    });
    describe('getError', function () {
        it('test model does not have error after reset', async () => {
            const validator = new ModelValidator(new TestIdModel({}));
            await validator.validate();
            expect(validator.getError('someNumber')).toBeDefined();
            expect(validator.getError('someNumber')).toEqual('someNumber must be a number conforming to the specified constraints');
        });
    });
    describe('validateField', function () {
        it('validate single field', async () => {
            const validator = new ModelValidator(new MultiFieldModel({}));
            const isValid = await validator.validateField('someString');
            expect(isValid).toEqual(false);
            expect(validator.getError('someString')).toBeDefined();
            expect(validator.getError('someNumber')).toBeUndefined();
        });
    });
    describe('custom rules', function () {
        it('custom validation rule validation', async () => {
            const validator = new ModelValidator(new MultiFieldModel({ someNumber: 2, someString: 'test' }), {
                rules: {
                    someNumber: [
                        (val, result) => {
                            var _a;
                            if (val < 3) {
                                (_a = result.errors) === null || _a === void 0 ? void 0 : _a.push('lower than 3');
                            }
                            return result;
                        },
                    ],
                },
            });
            expect(await validator.validate()).toEqual(false);
            expect(validator.getError('someNumber')).toEqual('lower than 3');
        });
    });
});
