import { InjectModel } from '@nestjs/mongoose';
import { buildDataPointModelName } from '../schemas';

export const InjectDataPointModel = (contentName: string) =>
  InjectModel(buildDataPointModelName(contentName));
