import { ContentScore } from "../../schemas";
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema()
export class TestContentScore extends ContentScore {}

export const TestContentScoreSchema = SchemaFactory.createForClass(TestContentScore);
export type TestContentScoreDocument = TestContentScore & mongoose.Document;

@Schema()
export class ExtendedTestContentScore extends ContentScore<ExtendedTestContentScore> {
    @Prop({ type: String, required: true })
    special: string;

    getSpecialValue() {
        return '_' + this.special + '_'
    }
}

export const ExtendedTestContentScoreSchema = SchemaFactory.createForClass(ExtendedTestContentScore);
export type ExtendedTestContentScoreDocument = ExtendedTestContentScore & mongoose.Document;
