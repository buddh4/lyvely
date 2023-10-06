import { __decorate, __metadata } from "tslib";
import { PropertyType } from './property-type.decorator';
import { BaseModel } from '../base.model';
describe('PropertyType', () => {
    it('test primitive value', async () => {
        class PlainSubModel extends BaseModel {
        }
        __decorate([
            PropertyType(String, { default: 'defaultValue' }),
            __metadata("design:type", String)
        ], PlainSubModel.prototype, "value", void 0);
        const model = new PlainSubModel();
        expect(model.value).toEqual('defaultValue');
    });
    it('test string default value', async () => {
        class PlainSubModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], PlainSubModel.prototype, "value", void 0);
        const model = new PlainSubModel();
        expect(model.value).toEqual('');
    });
    it('test number default value', async () => {
        class PlainSubModel extends BaseModel {
        }
        __decorate([
            PropertyType(Number),
            __metadata("design:type", Number)
        ], PlainSubModel.prototype, "value", void 0);
        const model = new PlainSubModel();
        expect(model.value).toEqual(0);
    });
    it('test boolean default value', async () => {
        class PlainSubModel extends BaseModel {
        }
        __decorate([
            PropertyType(Boolean),
            __metadata("design:type", Boolean)
        ], PlainSubModel.prototype, "value", void 0);
        const model = new PlainSubModel();
        expect(model.value).toEqual(false);
    });
    it('basic constructor', async () => {
        class PlainSubModel {
        }
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(PlainSubModel),
            __metadata("design:type", PlainSubModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel({ sub: { value: 'test' } });
        expect(model.sub instanceof PlainSubModel).toEqual(true);
    });
    it('cascading type constructor', async () => {
        class ValueModel {
        }
        class PlainSubModel {
        }
        __decorate([
            PropertyType(ValueModel),
            __metadata("design:type", ValueModel)
        ], PlainSubModel.prototype, "sub", void 0);
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(PlainSubModel),
            __metadata("design:type", PlainSubModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel({ sub: { sub: { value: 'test' } } });
        expect(model.sub instanceof PlainSubModel).toEqual(true);
        expect(model.sub.sub instanceof ValueModel).toEqual(true);
    });
    it('assure afterInit is called', async () => {
        class ValueModel {
            afterInit() {
                this.value = this.value || 'default';
            }
        }
        class PlainSubModel {
        }
        __decorate([
            PropertyType(ValueModel),
            __metadata("design:type", ValueModel)
        ], PlainSubModel.prototype, "sub", void 0);
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(PlainSubModel),
            __metadata("design:type", PlainSubModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel({ sub: { sub: {} } });
        expect(model.sub.sub.value).toEqual('default');
    });
    it('assure optional property is not initialized by default', async () => {
        class ValueModel {
        }
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(ValueModel, { optional: true }),
            __metadata("design:type", ValueModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel();
        expect(model.sub).toBeUndefined();
    });
    it('assure non optional property is initialized by default', async () => {
        class ValueModel {
            afterInit() {
                this.value = this.value || 'defaultValue';
            }
        }
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(ValueModel),
            __metadata("design:type", ValueModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel();
        expect(model.sub).toBeDefined();
        expect(model.sub.value).toEqual('defaultValue');
    });
    it('assure afterInit is not called for existing property', async () => {
        let counter = 0;
        class ValueModel {
            afterInit() {
                counter++;
            }
        }
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(ValueModel),
            __metadata("design:type", ValueModel)
        ], TestModel.prototype, "sub", void 0);
        new TestModel({ sub: new ValueModel() });
        expect(counter).toEqual(1);
    });
    it('assure empty default value is assigned', async () => {
        class ValueModel {
            constructor(value) {
                this.value = value;
            }
        }
        class PlainSubModel {
        }
        __decorate([
            PropertyType(ValueModel, {
                default: () => new ValueModel('defaultValue'),
            }),
            __metadata("design:type", ValueModel)
        ], PlainSubModel.prototype, "sub", void 0);
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(PlainSubModel),
            __metadata("design:type", PlainSubModel)
        ], TestModel.prototype, "sub", void 0);
        const model = new TestModel({ sub: {} });
        expect(model.sub.sub.value).toEqual('defaultValue');
    });
    it('assure properties are inherited', async () => {
        class MyModel extends BaseModel {
        }
        __decorate([
            PropertyType(String, { default: 'Test' }),
            __metadata("design:type", String)
        ], MyModel.prototype, "field", void 0);
        class SubModel extends MyModel {
        }
        class SubSubModel extends MyModel {
        }
        const model = new SubSubModel();
        expect(model.field).toEqual('Test');
    });
    it('assure property types are overwritten by parent', async () => {
        class Parent extends BaseModel {
        }
        __decorate([
            PropertyType(String, { default: 'Parent' }),
            __metadata("design:type", String)
        ], Parent.prototype, "field", void 0);
        class SubModel extends Parent {
        }
        const model = new SubModel();
        expect(model.field).toEqual('Parent');
    });
    it('assure property types are overwritten by child', async () => {
        class Parent extends BaseModel {
        }
        __decorate([
            PropertyType(String, { default: 'Parent' }),
            __metadata("design:type", String)
        ], Parent.prototype, "field", void 0);
        class SubModel extends Parent {
        }
        __decorate([
            PropertyType(String, { default: 'Child' }),
            __metadata("design:type", String)
        ], SubModel.prototype, "field", void 0);
        const model = new SubModel();
        expect(model.field).toEqual('Child');
    });
    it('test array without default', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", Array)
        ], TestModel.prototype, "arr", void 0);
        const model = new TestModel();
        expect(model.arr).toBeDefined();
        expect(model.arr.length).toEqual(0);
    });
    it('test string array without default', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType([String]),
            __metadata("design:type", Array)
        ], TestModel.prototype, "arr", void 0);
        const model = new TestModel();
        expect(model.arr).toBeDefined();
        expect(model.arr.length).toEqual(0);
    });
    it('test string array with init value', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType([String]),
            __metadata("design:type", Array)
        ], TestModel.prototype, "arr", void 0);
        const model = new TestModel({ arr: ['test'] });
        expect(model.arr).toBeDefined();
        expect(model.arr.length).toEqual(1);
        expect(model.arr[0]).toEqual('test');
    });
    it('test typed array', async () => {
        class SubModel {
        }
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType([SubModel]),
            __metadata("design:type", Array)
        ], TestModel.prototype, "arr", void 0);
        const model = new TestModel({ arr: [{ value: 'v1' }, { value: 'v2' }] });
        expect(model.arr).toBeDefined();
        expect(model.arr.length).toEqual(2);
        expect(model.arr[0].value).toEqual('v1');
        expect(model.arr[0] instanceof SubModel).toEqual(true);
        expect(model.arr[1].value).toEqual('v2');
        expect(model.arr[1] instanceof SubModel).toEqual(true);
    });
    it('test string to date conversion', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Date),
            __metadata("design:type", Date)
        ], TestModel.prototype, "date", void 0);
        const model = new TestModel({ date: '2022-07-23T15:47:51.518Z' });
        expect(model.date instanceof Date).toEqual(true);
        expect(model.date.getFullYear()).toEqual(2022);
        expect(model.date.getDate()).toEqual(23);
        expect(model.date.getMonth()).toEqual(6);
    });
    it('transform to null', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(null),
            __metadata("design:type", void 0)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: 1 });
        expect(model.val).toEqual(null);
    });
    it('transform to undefined', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(undefined),
            __metadata("design:type", void 0)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: 1 });
        expect(model.val).toEqual(undefined);
    });
    it('transform number to string', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: 1 });
        expect(model.val).toEqual('1');
    });
    it('transform true to string', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: true });
        expect(model.val).toEqual('true');
    });
    it('transform false to string', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: false });
        expect(model.val).toEqual('false');
    });
    it('transform bigint to string', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: BigInt(123) });
        expect(model.val).toEqual('123');
    });
    it('transform bigint to string', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: BigInt(123) });
        expect(model.val).toEqual('123');
    });
    it('transform object to string results in empty string if not optional', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: { test: 'test' } });
        expect(model.val).toEqual('');
    });
    it('transform object to string results in null if optional', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(String, { optional: true }),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: { test: 'test' } });
        expect(model.val).toEqual(null);
    });
    it('transform number to true', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Boolean),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: 1 });
        expect(model.val).toEqual(true);
    });
    it('transform number to false', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Boolean),
            __metadata("design:type", String)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: 0 });
        expect(model.val).toEqual(false);
    });
    it('transform string to int', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Number),
            __metadata("design:type", Number)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: '123' });
        expect(model.val).toEqual(123);
    });
    it('transform string to float', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Number),
            __metadata("design:type", Number)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: '1.2' });
        expect(model.val).toEqual(1.2);
    });
    it('transform string invalid float', async () => {
        class TestModel extends BaseModel {
        }
        __decorate([
            PropertyType(Number, { optional: true }),
            __metadata("design:type", Number)
        ], TestModel.prototype, "val", void 0);
        const model = new TestModel({ val: '1,2' });
        expect(model.val).toEqual(null);
    });
});
