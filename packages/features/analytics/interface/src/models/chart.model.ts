import { ContentModel, IEditableModel } from '@lyvely/interface';
import { Expose } from 'class-transformer';
import type { IChart, IChartConfig } from '../interfaces';
import { UpdateChartModel } from './update-chart.model';

export class ChartModel<TID = string, TConfig extends IChartConfig = IChartConfig>
  extends ContentModel<TID, TConfig>
  implements IChart, IEditableModel<UpdateChartModel>
{
  static contentType = 'Chart';

  @Expose()
  override type = ChartModel.contentType;

  toEditModel(): UpdateChartModel {
    return new UpdateChartModel({
      text: this.getText(),
      title: this.getTitle(),
    });
  }
}
