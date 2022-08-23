import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../db/base.entity';
import { ITag, REGEX_HEX_COLOR } from '@lyvely/common';
import randomColor from "randomcolor";

@Schema()
export class Tag extends BaseEntity<Tag> implements ITag {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true, match: REGEX_HEX_COLOR })
  color: string;

  @Prop( { type: Boolean })
  archived?: boolean;

  isNew: boolean;

  static create(obj: Partial<Tag>) {
    return new Tag({ isNew: true, ...obj });
  }

  protected afterInit() {
    super.afterInit();
    this.archived = this.archived ?? false;
    this.isNew = this.isNew ?? false;
    this.color = this.color || randomColor({ luminosity: 'dark' })
  }
}

export const TagSchema = SchemaFactory.createForClass(Tag);
