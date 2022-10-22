import { Controller } from '@nestjs/common';
import { UseClassSerializer } from '@/core';

@Controller()
@UseClassSerializer()
export class PasswordResetController {}
