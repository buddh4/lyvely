import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ContentDataType,
  ContentTypeService,
  FieldValidationException,
  ProtectedProfileContext,
  UpdateQuerySet,
} from '@lyvely/api';
import { Chart, ChartConfig } from '../schemas';
import { ChartType, CreateChartModel, UpdateChartModel } from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import { GraphChartConfig } from '../schemas/graph-chart.schema';

@Injectable()
export class ChartsService extends ContentTypeService<Chart, CreateChartModel, UpdateChartModel> {
  protected logger = new Logger(ChartsService.name);

  @Inject()
  protected contentDao: ChartsDao;

  protected async createInstance(
    context: ProtectedProfileContext,
    model: CreateChartModel,
  ): Promise<Chart> {
    const { profile, user } = context;
    const { text, title, type } = model;
    const config = this.createChartConfigByType(type);

    if (!config) throw new FieldValidationException([{ property: 'type', errors: ['invalid'] }]);

    return new Chart(profile, user, {
      content: new ContentDataType({ title, text }),
      config,
    });
  }

  private createChartConfigByType(type: ChartType): ChartConfig | undefined {
    switch (type) {
      case ChartType.Graph:
        return new GraphChartConfig();
    }
  }

  protected async createUpdate(
    context: ProtectedProfileContext,
    content: Chart,
    model: UpdateChartModel,
  ): Promise<UpdateQuerySet<Chart>> {
    const update: UpdateQuerySet<Chart> = {};
    if (model.title) {
      update['content.title'] = model.title;
    }
    if (model.text) {
      update['content.text'] = model.text;
    }
    return update;
  }
}
