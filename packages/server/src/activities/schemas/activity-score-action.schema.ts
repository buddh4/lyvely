import { CreateProfileScoreAction, ProfileScoreAction } from "../../profiles";
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Activity } from "./activity.schema";
import { assureObjectId } from "../../db/db.utils";

type CreateActivityScoreAction = CreateProfileScoreAction<ActivityScoreAction> & { activity?: Activity }

@Schema({ timestamps: true })
export class ActivityScoreAction extends ProfileScoreAction<ActivityScoreAction> {
    @Prop({ type: mongoose.Schema.Types.ObjectId })
    cid: mongoose.Types.ObjectId;

    constructor(data: CreateActivityScoreAction = {}) {
        super(data);
        data.cid = data.activity ? assureObjectId(data.activity) : data.cid;
    }
}

export const ActivityScoreActionSchema = SchemaFactory.createForClass(ActivityScoreAction);
export type ActivityScoreActionDocument = ActivityScoreAction & mongoose.Document;
