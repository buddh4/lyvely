import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UsersService } from '@/users';
import { UserStatus } from '@lyvely/core-interface';
import bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'usernameOrEmail', passwordField: 'password' });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByUsernameOrMainEmail(usernameOrEmail);

    if (!user || user.status === UserStatus.Disabled) throw new UnauthorizedException();

    return (await this.validatePassword(user, password)) ? user : false;
  }

  protected async validatePassword(user: User, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
