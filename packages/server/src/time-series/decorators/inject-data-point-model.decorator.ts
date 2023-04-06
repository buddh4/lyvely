import { InjectModel } from '@nestjs/mongoose';
import { buildDataPointModelName } from '@/time-series';

export const InjectDataPointModel = (contentName: string) =>
  InjectModel(buildDataPointModelName(contentName));
