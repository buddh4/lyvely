import { ProfileScoreActionService } from "../../profiles";
import { ActivityScoreAction } from "../schemas/activity-score-action.schema";
import { ActivityScoreActionDao } from "../daos/activity-score-action.dao";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class ActivityScoreActionService extends ProfileScoreActionService<ActivityScoreAction> {
    @Inject()
    protected profileScoreActionDao: ActivityScoreActionDao;
}
