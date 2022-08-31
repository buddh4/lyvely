import { expect } from '@jest/globals';
import { validate, IsEmail, MinLength, IsOptional } from 'class-validator';
import { PartialType } from "../interfaces/mapped-types/partial-type.helper";

export class BaseClass {

  @IsEmail()
  email: string;

  getBase() {
    return 'base';
  }

  constructor(obj: Partial<CreateUserDto>) {
    Object.assign(this, obj);
  }
}

export class CreateUserDto extends BaseClass {

  @MinLength(10)
  password: string;

  getTest() {
    return 'test';
  }
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

describe('PartialType', () => {

  describe('validate', function () {
    it('test all fields are optional', async () => {
      const model = new UpdateUserDto();
      const validation = await validate(model);
      expect(validation.length).toEqual(0);
    });

    it('test partial type constructor', async () => {
      const model = new UpdateUserDto({ email: 'test@test.de' });
      expect(model.email).toEqual('test@test.de');
      const validation = await validate(model);
      expect(validation.length).toEqual(0);
    });

    it('test invalid optional field', async () => {
      const model = new UpdateUserDto({ email: 'test@test' });
      const validation = await validate(model);
      expect(validation.length).toEqual(1);
    });

    it('test method inheritance', async () => {
      const model = new UpdateUserDto({ email: 'test@test' });
      expect(typeof model.getTest).toEqual('function');
      expect(model.getTest()).toEqual('test');
    });

    it('test base class inheritance', async () => {
      const model = new UpdateUserDto({ email: 'test@test' });
      expect(typeof model.getBase).toEqual('function');
      expect(model.getBase()).toEqual('base');
    });
  });
});
