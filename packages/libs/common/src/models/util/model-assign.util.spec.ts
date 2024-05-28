import { initBaseModelData } from './index';
import { getObjectId } from 'mongo-seeding';
import { PropertyType } from '../decorators';

class TestClass {
  constructor(
    public field: string,
    public sub?: TestClass
  ) {}
}

describe('model assign util', () => {
  describe('initBaseModelData()', function () {
    describe('getDefaults', () => {
      it('skipGetDefaults prevents defaults on root', () => {
        const model = {
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          },
        } as any;
        initBaseModelData(model, {}, { skipGetDefaults: true });
        expect(model.test).toBeUndefined();
      });

      it('getDefaults on root should be applied even if no data is supplied', () => {
        const model = {
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          },
        } as any;
        initBaseModelData(model);
        expect(model.test).toEqual('defaultValue');
      });

      it('getDefaults on root should be applied', () => {
        const model = {
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          },
        } as any;
        initBaseModelData(model, {});
        expect(model.test).toEqual('defaultValue');
      });

      it('getDefaults does not overwrite existing value', () => {
        const model = {
          getDefaults() {
            return {
              test: 'overwritten',
            };
          },
        } as any;
        initBaseModelData(model, {
          test: 'value',
        });
        expect(model.test).toEqual('value');
      });

      it('skipGetDefaults prevents defaults on property', () => {
        const model = {
          sub: {
            getDefaults() {
              return {
                test: 'defaultValue',
              };
            },
          },
        } as any;
        initBaseModelData(model, { sub: {} }, { skipGetDefaults: true });
        expect(model.sub.test).toBeUndefined();
      });

      it('getDefaults on property should be applied', () => {
        class Sub {
          test: string;
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          }
        }

        class Main {
          @PropertyType(Sub)
          sub: Sub;
        }

        const model = initBaseModelData(new Main());
        expect(model.sub.test).toEqual('defaultValue');
      });

      it('getDefaults on array property entry should be applied', () => {
        class Sub {
          test: string;
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          }
        }

        class Main {
          @PropertyType([Sub])
          sub: Sub[];
        }

        const model = initBaseModelData<any>(new Main(), {
          sub: [{}],
        });
        expect(model.sub[0].test).toEqual('defaultValue');
      });

      it('skipGetDefaults prevents defaults on property', () => {
        class Sub {
          test: string;
          getDefaults() {
            return {
              test: 'defaultValue',
            };
          }
        }
        class Main {
          @PropertyType([Sub])
          sub: Sub[];
        }

        const model = initBaseModelData<any>(
          new Main(),
          {
            sub: [{}],
          },
          { skipGetDefaults: true }
        );
        expect(model.sub[0].test).toBeUndefined();
      });
    });

    describe('afterInit', () => {
      it('afterInit on root should be applied', () => {
        const model = {
          afterInit() {
            this.test = 'value';
          },
        } as any;
        initBaseModelData(model, {});
        expect(model.test).toEqual('value');
      });

      it('afterInit on root should be applied even if not data is provided', () => {
        const model = {
          afterInit() {
            this.test = 'value';
          },
        } as any;
        initBaseModelData(model);
        expect(model.test).toEqual('value');
      });

      it('skipAfterInit should prevent afterInitCall', () => {
        const model = {
          afterInit() {
            this.test = 'value';
          },
        } as any;
        initBaseModelData(model, {}, { skipAfterInit: true });
        expect(model.test).toBeUndefined();
      });

      it('afterInit on property should be applied', () => {
        class Sub {
          test: string;
          afterInit() {
            this.test = 'value';
          }
        }

        class Main {
          @PropertyType(Sub)
          sub: Sub;
        }

        const model = initBaseModelData(new Main());
        expect(model.sub.test).toEqual('value');
      });

      it('afterInit on array property entry should be applied', () => {
        class Sub {
          test: string;
          afterInit() {
            this.test = 'value';
          }
        }
        class Main {
          @PropertyType([Sub])
          sub: Sub[];
        }

        const model = initBaseModelData<any>(new Main(), {
          sub: [{}],
        });
        expect(model.sub[0].test).toEqual('value');
      });
    });

    describe('id transformation', () => {
      it('id transformation on root should be applied', () => {
        const model = initBaseModelData<any>(
          {},
          {
            _id: getObjectId('test'),
          }
        );
        expect(model.id).toEqual(getObjectId('test').toString());
      });

      it('id transformation on property should be applied', () => {
        class Sub {
          id: string;
        }
        class Main {
          @PropertyType(Sub)
          sub: Sub;
        }
        const model = initBaseModelData<any>(new Main(), {
          sub: {
            _id: getObjectId('test'),
          },
        });
        expect(model.sub.id).toEqual(getObjectId('test').toString());
      });

      it('id transformation on array property should be applied', () => {
        class Sub {
          id: string;
        }
        class Main {
          @PropertyType([Sub])
          sub: Sub[];
        }

        const model = initBaseModelData<any>(new Main(), {
          sub: [<any>{ _id: getObjectId('test') }],
        });
        expect(model.sub[0].id).toEqual(getObjectId('test').toString());
      });
    });

    describe('init props', () => {
      it('@PropertyType default should be applied', () => {
        class Main {
          @PropertyType(Number, { default: 5 })
          sub: number;
        }

        const model = initBaseModelData<any>(new Main(), {});
        expect(model.sub).toEqual(5);
      });

      it('@PropertyType default should not be applied if skipInitProps option is true', () => {
        class Main {
          @PropertyType(Number, { default: 5 })
          sub: number;
        }

        const model = initBaseModelData<any>(new Main(), {}, { skipInitProps: true });
        expect(model.sub).toBeUndefined();
      });
    });

    it('simple string field assign', () => {
      const model = {} as any;
      const result = initBaseModelData(model, { test: 'test' });
      expect(model).toEqual(result);
      expect(model.test).toEqual('test');
    });

    it('do not assign function', () => {
      const model = {} as any;
      initBaseModelData(model, { testFunc: () => 'test' });
      expect(model.testFunc).toBeUndefined();
    });

    it('assign constructor of deep field', () => {
      const model = {} as any;
      initBaseModelData(model, { test: new TestClass('testValue', new TestClass('testValue2')) });
      expect(model.test).toBeDefined();
      expect(model.test.sub).toBeDefined();
      expect(model.test.sub.field).toEqual('testValue2');
      expect(model.test.sub instanceof TestClass).toEqual(true);
    });

    it('do not assign unknown field if strict = true', () => {
      const model = { exists: 'oldValue' } as any;
      initBaseModelData(model, { exists: 'newValue', doesNotExist: 'value' }, { strict: true });
      expect(model.exists).toEqual('newValue');
      expect(model.doesNotExist).toBeUndefined();
    });

    it('assign array value', () => {
      const obj = { arr: ['v1', 'v2'] };
      const result = <any>initBaseModelData({}, { arr: ['v1', 'v2'] });
      expect(result.arr).toBeDefined();
      expect(Array.isArray(result.arr)).toEqual(true);
      expect(result.arr.length).toEqual(2);
      expect(result.arr[0]).toEqual('v1');
      expect(result.arr[1]).toEqual('v2');
      expect(obj.arr !== result.arr).toEqual(true);
    });

    it('assign array value', () => {
      const obj = { arr: [new TestClass('testValue')] };
      const result = <any>initBaseModelData({}, obj);
      expect(result?.arr[0].field).toEqual('testValue');
      expect(result.arr[0] instanceof TestClass).toEqual(true);
      expect(result.arr[0]).toEqual(obj.arr[0]);
    });

    it('assign with path', () => {
      const update = { rootValue: 'updated', 'sub.sub.value': 'value' };
      const obj = { rootValue: 'test', sub: { sub: { value: 'test' } } };
      initBaseModelData(obj, update);
      expect(obj.rootValue).toEqual('updated');
      expect(obj.sub.sub.value).toEqual('value');
    });
  });
});
