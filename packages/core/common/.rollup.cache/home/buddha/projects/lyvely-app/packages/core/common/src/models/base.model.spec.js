import { __decorate, __metadata } from "tslib";
import { DocumentModel } from '../index';
import { Exclude, Expose, instanceToPlain } from 'class-transformer';
class MockObjectId {
    constructor(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
let TestBaseDto = class TestBaseDto extends DocumentModel {
};
__decorate([
    Expose(),
    __metadata("design:type", Number)
], TestBaseDto.prototype, "value", void 0);
TestBaseDto = __decorate([
    Exclude()
], TestBaseDto);
let TestDocumentDto = class TestDocumentDto extends DocumentModel {
    someFunction() {
        return 'yes';
    }
};
__decorate([
    Expose(),
    __metadata("design:type", String)
], TestDocumentDto.prototype, "stringValue", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Number)
], TestDocumentDto.prototype, "numberValue", void 0);
__decorate([
    Expose(),
    __metadata("design:type", Object)
], TestDocumentDto.prototype, "subModel", void 0);
TestDocumentDto = __decorate([
    Exclude()
], TestDocumentDto);
describe('Base Model', () => {
    describe('BaseModel constructor', function () {
        it('basic constructor', async () => {
            const baseModel = new TestDocumentDto({
                stringValue: 'Test',
                numberValue: 5,
            });
            expect(baseModel.stringValue).toEqual('Test');
            expect(baseModel.numberValue).toEqual(5);
            expect(baseModel.subModel).toBeUndefined();
        });
        it('do not overwrite functions', async () => {
            const baseModel = new TestDocumentDto({
                someFunction: () => 'no',
            });
            expect(baseModel.someFunction()).toEqual('yes');
        });
        it('basic constructor with sub model', async () => {
            var _a;
            const baseModel = new TestDocumentDto({
                subModel: new TestBaseDto({
                    value: 10,
                }),
            });
            expect(baseModel.subModel).toBeDefined();
            expect((_a = baseModel.subModel) === null || _a === void 0 ? void 0 : _a.value).toEqual(10);
        });
        it('transform sub document _id to model string id', async () => {
            var _a;
            const obj = {
                _id: new MockObjectId('test'),
                value: 10,
            };
            const baseModel = new TestDocumentDto({ subModel: new TestBaseDto(obj) });
            expect(baseModel.subModel).toBeDefined();
            expect((_a = baseModel.subModel) === null || _a === void 0 ? void 0 : _a.id).toEqual('test');
        });
        it('test transform document _id to model string id', async () => {
            const obj = {
                _id: new MockObjectId('test'),
                secret: 'asdf',
            };
            const baseModel = new TestDocumentDto(obj);
            expect(baseModel.id).toBeDefined();
            expect(typeof baseModel.id).toEqual('string');
        });
        it('test exclude _id', async () => {
            const obj = {
                _id: new MockObjectId('test'),
                secret: 'asdf',
            };
            const baseModel = new TestDocumentDto(obj);
            expect(instanceToPlain(baseModel)._id).toBeUndefined();
        });
    });
});
