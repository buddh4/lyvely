import { Module } from '@nestjs/common';
import { AvatarsController } from './controllers';

@Module({
  controllers: [AvatarsController],
})
export class AvatarsModule {}
