import { Module } from '@nestjs/common';
import { AvatarsController } from './controllers/avatars.controller';

@Module({
  controllers: [AvatarsController],
})
export class AvatarsModule {}
