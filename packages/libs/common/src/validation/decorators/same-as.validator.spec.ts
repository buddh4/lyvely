import { IsString, validate } from 'class-validator';
import { SameAs } from './same-as.validator';

class PasswordModel {
  @IsString()
  password: string;

  @SameAs('password')
  passwordRepeat: string;

  constructor(obj: Partial<PasswordModel>) {
    Object.assign(this, obj);
  }
}

describe('SameAs', function () {
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
