import { test, expect, beforeAll } from 'vitest';
import { BaseModel, type PropertiesOf } from '@lyvely/common';
import { I18nModelValidator } from './i18n-model.validator';
import { setMessages } from './i18n';
import { Length } from 'class-validator';

beforeAll(() => {
  setMessages('en-us', {
    test: {
      fields: {
        uniqueField: 'UniqueField',
        field: 'TestField',
      },
    },
  });
});

test('translate error without context set with setErrors', () => {
  class TestModel {
    uniqueField: string;

    constructor(data?: PropertiesOf<TestModel>) {
      BaseModel.init(this, data);
    }
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });

  validator.setErrors([{ property: 'uniqueField', errors: ['unique'] }]);
  expect(validator.getError('uniqueField')).to.eq('UniqueField already exists');
});

test('translate error with context set with setErrors', () => {
  class TestModel {
    @Length(3, 5)
    field: string;

    constructor(data?: PropertiesOf<TestModel>) {
      BaseModel.init(this, data);
    }
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });

  validator.setErrors([{ property: 'field', errors: ['isLength'] }]);
  expect(validator.getError('field')).to.eq('TestField must be between 3 and 5 characters');
});

test('translate field with context', async () => {
  class TestModel {
    @Length(3, 5)
    field: string;

    constructor(data?: PropertiesOf<TestModel>) {
      BaseModel.init(this, data);
    }
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });

  await validator.validate();
  expect(validator.getError('field')).to.eq('TestField must be between 3 and 5 characters');
});
