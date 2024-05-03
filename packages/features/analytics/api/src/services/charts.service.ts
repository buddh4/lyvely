import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ContentDataType,
  ContentTypeService,
  FieldValidationException,
  IntegrityException,
  ProtectedProfileContext,
  UpdateQuerySet,
} from '@lyvely/api';
import { Chart, ChartConfig } from '../schemas';
import { CreateChartModel, UpdateChartModel } from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import { ChartSeriesService } from './chart-series.service';
import { getChartCategoryDefinition } from '../registries';

@Injectable()
export class ChartsService extends ContentTypeService<Chart, CreateChartModel, UpdateChartModel> {
  protected logger = new Logger(ChartsService.name);

  @Inject()
  protected contentDao: ChartsDao;

  @Inject()
  protected chartSeriesService: ChartSeriesService;

  /**
   * Creates a new instance of a Chart according to the model.
   *
   * @param {ProtectedProfileContext} context - The context object containing profile and user information.
   * @param {CreateChartModel} model - The model object containing chart information.
   * @returns {Promise<Chart>} - A Promise that resolves to the newly created Chart instance.
   * @protected
   */
  protected async createInstance(
    context: ProtectedProfileContext,
    model: CreateChartModel,
  ): Promise<Chart> {
    const { text, title, category } = model;
    const config = this.createChartConfigByCategory(category);

    if (!config) throw new FieldValidationException([{ property: 'type', errors: ['invalid'] }]);

    const chart = new Chart(context, {
      content: new ContentDataType({ title, text }),
      config,
    });

    if (model.series) {
      const seriesConfig = await this.chartSeriesService.createAndValidateSeriesConfig(
        chart,
        model.series,
      );
      chart.addSeries(seriesConfig);
    }

    return chart;
  }

  /**
   * Creates a chart configuration object based on the given category.
   *
   * @param {string} category - The category of the chart.
   * @returns {ChartConfig | undefined} - The chart configuration object or undefined if no category is provided.
   * @private
   */
  private createChartConfigByCategory(category: string): ChartConfig | undefined {
    const categoryDefinition = getChartCategoryDefinition(category);
    if (!categoryDefinition) {
      throw new IntegrityException(`Chart category ${category} not registered.`);
    }
    const CategoryType = categoryDefinition?.configModel || ChartConfig;
    const config = new CategoryType();
    config.category ??= category;
    return config;
  }

  /**
   * Creates or updates a chart in the specified profile context.
   * This function is responsible for updating the chart metadata as title and text and not the series configuration.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} content - The chart content.
   * @param {UpdateChartModel} model - The chart model for updating.
   * @returns {Promise<UpdateQuerySet<Chart>>} - A promise that resolves with the update query for the chart.
   * @protected
   */
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
