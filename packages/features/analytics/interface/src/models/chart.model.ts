import { ContentModel, IEditableModel } from '@lyvely/interface';
import { Expose } from 'class-transformer';
import type { IChartStatus, IChart, IChartConfig } from '../interfaces';
import { UpdateChartModel } from './update-chart.model';
import { PartialPropertiesOf, Document } from '@lyvely/common';

export class ChartModel<TID = string, TConfig extends IChartConfig = IChartConfig>
  extends ContentModel<TID, ChartModel<any, TConfig>>
  implements IChart, IEditableModel<UpdateChartModel>
{
  static contentType = 'Chart';

  @Expose()
  type = ChartModel.contentType;

  @Expose()
  status: IChartStatus;

  @Expose()
  config: TConfig;

  constructor(data: PartialPropertiesOf<ChartModel<any>>) {
    super();
    Document.init(this, data);
  }

  toEditModel(): UpdateChartModel {
    return new UpdateChartModel({
      text: this.getText(),
      title: this.getTitle(),
    });
  }
}
