import { test, expect, beforeAll } from 'vitest';
import { BaseModel } from '@lyvely/common';
import { I18nModelValidator } from '@/i18n/i18n-model.validator';
import { setMessages } from '@/i18n/i18n';
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
  class TestModel extends BaseModel<TestModel> {
    uniqueField: string;
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });
  validator.setErrors([{ property: 'uniqueField', errors: ['unique'] }]);
  expect(validator.getError('uniqueField')).to.eq('UniqueField already exist');
});

test('translate error with context set with setErrors', () => {
  class TestModel extends BaseModel<TestModel> {
    @Length(3, 5)
    field: string;
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });

  validator.setErrors([{ property: 'field', errors: ['isLength'] }]);
  expect(validator.getError('field')).to.eq('TestField must be between 3 and 5 characters');
});

test('translate field with context', async () => {
  class TestModel extends BaseModel<TestModel> {
    @Length(3, 5)
    field: string;
  }

  const validator = new I18nModelValidator(new TestModel(), {
    labelKey: 'test.fields',
  });

  await validator.validate();
  expect(validator.getError('field')).to.eq('TestField must be between 3 and 5 characters');
});
