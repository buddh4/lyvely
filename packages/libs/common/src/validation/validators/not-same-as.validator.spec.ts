import { IsEmail, IsString, validate } from 'class-validator';
import { NotSameAs } from '../core.validators';

class EmailModel {
  @IsString()
  @NotSameAs('email')
  username: string;

  @IsEmail()
  email: string;

  constructor(obj: Partial<EmailModel>) {
    Object.assign(this, obj);
  }
}

describe('NotSameAs', function () {
  it('username should not match email', async () => {
    const baseModel = new EmailModel({ username: 'test@test.de', email: 'test@test.de' });
    const result = await validate(baseModel);
    expect(result.length).toEqual(1);
    expect(result[0].property).toEqual('username');
    expect(result[0].constraints?.['notMatch']).toEqual('username can not match with email');
  });
});
