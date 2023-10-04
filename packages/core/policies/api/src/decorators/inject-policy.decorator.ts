import { Inject } from '@nestjs/common';
import { getPolicyToken } from '../interfaces';

export const InjectPolicy = (name: string) => Inject(getPolicyToken(name));
