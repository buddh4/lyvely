import { Module } from '@nestjs/common';
import { AvatarsController } from '@/avatars/controllers/avatars.controller';

@Module({
  controllers: [AvatarsController],
})
export class AvatarsModule {}
