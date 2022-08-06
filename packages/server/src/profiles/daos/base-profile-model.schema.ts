import { BaseEntity, EntityType } from "../../db/base.entity";
import mongoose from "mongoose";
import { Prop } from "@nestjs/mongoose";

export interface BaseProfileModelEntity {
  pid: mongoose.Types.ObjectId;
  oid?: mongoose.Types.ObjectId;
}

export class BaseProfileModel<C extends BaseEntity<C>> extends BaseEntity<C> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: mongoose.Types.ObjectId;
}
