import { __decorate, __metadata } from "tslib";
import { Gte, Lte, Match, NotMatch } from './core.validators';
import { IsNumber, IsOptional, IsString, validate, IsMongoId, IsEmail } from 'class-validator';
class ObjectIdModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsMongoId(),
    IsOptional(),
    __metadata("design:type", String)
], ObjectIdModel.prototype, "id", void 0);
class PasswordModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsString(),
    __metadata("design:type", String)
], PasswordModel.prototype, "password", void 0);
__decorate([
    Match('password'),
    __metadata("design:type", String)
], PasswordModel.prototype, "passwordRepeat", void 0);
class EmailModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsString(),
    NotMatch('email'),
    __metadata("design:type", String)
], EmailModel.prototype, "username", void 0);
__decorate([
    IsEmail(),
    __metadata("design:type", String)
], EmailModel.prototype, "email", void 0);
class LteModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], LteModel.prototype, "num1", void 0);
__decorate([
    IsNumber(),
    Lte('num1'),
    __metadata("design:type", Number)
], LteModel.prototype, "num2", void 0);
class GteModel {
    constructor(obj) {
        Object.assign(this, obj);
    }
}
__decorate([
    IsNumber(),
    Gte('num2'),
    __metadata("design:type", Number)
], GteModel.prototype, "num1", void 0);
__decorate([
    IsNumber(),
    __metadata("design:type", Number)
], GteModel.prototype, "num2", void 0);
describe('Core Validators', () => {
    describe('ObjectId', function () {
        it('test invalid objectid', async () => {
            const baseModel = new ObjectIdModel({ id: 'notvalid' });
            const result = await validate(baseModel);
            expect(result.length).toEqual(1);
            expect(result[0].property).toEqual('id');
        });
        it('test valid objectid', async () => {
            const baseModel = new ObjectIdModel({ id: '507f1f77bcf86cd799439011' });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
        it('test optional objectid', async () => {
            const baseModel = new ObjectIdModel({});
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
    });
    describe('Match', function () {
        it('password does not match repeated password', async () => {
            const baseModel = new PasswordModel({ password: 'xxx', passwordRepeat: 'yyy' });
            const result = await validate(baseModel);
            expect(result.length).toEqual(1);
            expect(result[0].property).toEqual('passwordRepeat');
        });
        it('password does match repeated password', async () => {
            const baseModel = new PasswordModel({ password: 'xxx', passwordRepeat: 'xxx' });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
    });
    describe('NotMatch', function () {
        it('username should not match email', async () => {
            var _a;
            const baseModel = new EmailModel({ username: 'test@test.de', email: 'test@test.de' });
            const result = await validate(baseModel);
            expect(result.length).toEqual(1);
            expect(result[0].property).toEqual('username');
            expect((_a = result[0].constraints) === null || _a === void 0 ? void 0 : _a['notMatch']).toEqual('username can not match with email');
        });
    });
    describe('Lte', function () {
        it('num1 lower num2', async () => {
            const baseModel = new LteModel({ num1: 1, num2: 3 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(1);
            expect(result[0].property).toEqual('num2');
        });
        it('num1 eq num2', async () => {
            const baseModel = new LteModel({ num1: 1, num2: 1 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
        it('num1 higher num2', async () => {
            const baseModel = new LteModel({ num1: 2, num2: 1 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
    });
    describe('Gte', function () {
        it('num1 lower num2', async () => {
            const baseModel = new GteModel({ num1: 1, num2: 3 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(1);
            expect(result[0].property).toEqual('num1');
        });
        it('num1 eq num2', async () => {
            const baseModel = new GteModel({ num1: 1, num2: 1 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
        it('num1 higher num2', async () => {
            const baseModel = new GteModel({ num1: 2, num2: 1 });
            const result = await validate(baseModel);
            expect(result.length).toEqual(0);
        });
    });
});
