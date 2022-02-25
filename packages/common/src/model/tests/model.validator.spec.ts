import { IsDefined, IsNumber } from 'class-validator';
import { ModelValidator } from '../../index';


class TestIdModel {
  @IsNumber()
  @IsDefined()
  someNumber?: number;

  constructor(obj: Partial<TestIdModel>) {
    Object.assign(this, obj);
  }
}

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
      expect(validator.getError('someNumber')).toEqual('someNumber should not be null or undefined');
    });
  });
});