import type { StrictBaseModelData } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';
import { Exclude, Expose } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber } from 'class-validator';

@Exclude()
export class UpdateTaskListItemModel {
  @Expose()
  @IsBoolean()
  checked: boolean;

  @Expose()
  @IsNumber({}, { each: true })
  position: [number, number];

  @Expose()
  @IsDate()
  @PropertyType(Date)
  version: Date;

  constructor(data: StrictBaseModelData<UpdateTaskListItemModel>) {
    BaseModel.init(this, data);
  }
}
