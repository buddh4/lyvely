import { BaseEntity, EntityType } from "../../../core/db/base.entity";
import mongoose from "mongoose";
import { Prop } from "@nestjs/mongoose";

export interface BaseProfileModelEntity {
  pid: TObjectId;
  oid?: TObjectId;
}

export class BaseProfileModel<C extends BaseEntity<C>> extends BaseEntity<C> {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  oid: TObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  pid: TObjectId;
}
