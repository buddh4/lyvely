import { ProfileScoreActionDao } from "../../profiles";
import { ActivityScoreAction } from "../schemas/activity-score-action.schema";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import module from '../activities.meta';
import { Model } from 'mongoose';

@Injectable()
export class ActivityScoreActionDao extends ProfileScoreActionDao<ActivityScoreAction> {

    @InjectModel(ActivityScoreAction.name)
    protected model: Model<ActivityScoreAction>;

    getModelConstructor() {
        return ActivityScoreAction;
    }

    getModuleId(): string {
        return module.id;
    }
}
