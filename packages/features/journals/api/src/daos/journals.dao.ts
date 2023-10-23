import { Journal } from '../schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from '@lyvely/core';
import { TimeSeriesContentDao } from '@lyvely/time-series';

@Injectable()
export class JournalsDao extends TimeSeriesContentDao<Journal> {
  @InjectModel(Journal.name)
  protected model: Model<Journal>;

  getModelConstructor() {
    return Journal;
  }

  getModuleId(): string {
    return 'journals';
  }
}
