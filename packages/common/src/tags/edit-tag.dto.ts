import { BaseDto } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsHexColor, IsString, IsOptional } from 'class-validator';
import randomColor from "randomcolor";

@Exclude()
export class EditTagDto extends BaseDto<EditTagDto> {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsHexColor()
  @IsNotEmpty()
  color: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  constructor(obj?: Partial<EditTagDto>) {
    super(obj);
    this.color = this.color || randomColor({ luminosity: 'dark' });
  }
}
