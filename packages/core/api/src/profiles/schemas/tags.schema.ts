import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '@/core';
import { REGEX_HEX_COLOR, PropertiesOf } from '@lyvely/common';
import { TagModel } from '@lyvely/core-interface';
import randomColor from 'randomcolor';

@Schema()
export class Tag extends BaseEntity<Tag> implements PropertiesOf<TagModel> {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, required: true, match: REGEX_HEX_COLOR })
  color: string;

  @Prop({ type: String })
  description: string;

  @Prop({ type: Boolean })
  archived?: boolean;

  @Prop({ type: Boolean })
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
    this.color = this.color || randomColor({ luminosity: 'dark' });
  }
}

export const TagSchema = SchemaFactory.createForClass(Tag);
