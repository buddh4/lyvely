import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { UsersModule } from '@/users';
import { AccountService } from '@/account/services/account.service';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [UsersModule],
})
export class AccountModule {}
