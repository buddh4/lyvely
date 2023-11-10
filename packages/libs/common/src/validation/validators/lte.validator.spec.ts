import { IsNumber, validate } from 'class-validator';
import { Lte } from '../core.validators';

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
