import { Profile, ProfileScoreService } from "../../profiles";
import { Inject, Injectable } from "@nestjs/common";
import { ContentScore } from "../schemas";
import { ContentScoreDao } from "../daos";

@Injectable()
export class ContentScoreService extends ProfileScoreService<ContentScore> {
    @Inject()
    protected profileScoreDao: ContentScoreDao;
}
