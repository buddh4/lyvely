import { IsNumber, validate } from 'class-validator';
import { Gte } from './gte.validator';

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
