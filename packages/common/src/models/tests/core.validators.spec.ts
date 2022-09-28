import { Gte, Lte, Match, ObjectId } from '@/models';
import { IsNumber, IsOptional, IsString, validate, IsMongoId } from 'class-validator';

class ObjectIdModel {
  @IsMongoId()
  @IsOptional()
  id?: string;

  constructor(obj: Partial<ObjectIdModel>) {
    Object.assign(this, obj);
  }
}

class PasswordModel {
  @IsString()
  password: string;

  @Match('password')
  passwordRepeat: string;

  constructor(obj: Partial<PasswordModel>) {
    Object.assign(this, obj);
  }
}

class LteModel {
  @IsNumber()
  num1: number;

  @IsNumber()
  @Lte('num1')
  num2: number;

  constructor(obj: Partial<LteModel>) {
    Object.assign(this, obj);
  }
}

class GteModel {
  @IsNumber()
  @Gte('num2')
  num1: number;

  @IsNumber()
  num2: number;

  constructor(obj: Partial<GteModel>) {
    Object.assign(this, obj);
  }
}

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
