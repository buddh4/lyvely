import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

export const UseClassSerializer = () => UseInterceptors(ClassSerializerInterceptor);
