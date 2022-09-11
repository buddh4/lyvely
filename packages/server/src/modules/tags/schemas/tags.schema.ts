import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../../core/db/base.entity';
import { TagModel, REGEX_HEX_COLOR } from '@lyvely/common';
import randomColor from "randomcolor";
import { PropertiesOf } from "@lyvely/common/src";

@Schema()
export class Tag extends BaseEntity<Tag> implements PropertiesOf<TagModel> {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true, match: REGEX_HEX_COLOR })
  color: string;

  @Prop( { type: String })
  description: string;

  @Prop( { type: Boolean })
  archived?: boolean;

  @Prop( { type: Boolean })
  includeOnFilter: boolean;

  isNew: boolean;

  static create(obj: Partial<Tag>) {
    return new Tag({ isNew: true, ...obj });
  }

  afterInit() {
    super.afterInit();
    // TODO: currently we need to add all new default values since missing values won't be updated at the moment
    this.archived = this.archived ?? false;
    this.description = this.description || '';
    this.isNew = this.isNew ?? false;
    this.includeOnFilter = this.includeOnFilter ?? false;
    this.color = this.color || randomColor({ luminosity: 'dark' })
  }
}

export const TagSchema = SchemaFactory.createForClass(Tag);
