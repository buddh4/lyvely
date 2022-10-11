import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserStatus } from '@lyvely/common';
import { User, UsersService } from '@/modules/users';
import bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersService.findUserByMainEmail(email);

    if (!user || user.status === UserStatus.Disabled) throw new UnauthorizedException();

    return (await this.validatePassword(user, password)) ? user : false;
  }

  protected async validatePassword(user: User, password: string) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          reject(error);
        }

        resolve(isMatch);
      });
    });
  }
}
