import { Request } from "express";
import { Profile } from "../schemas";
import { User } from "../../users";
import { UserWithProfileAndRelations } from "../models";
import { RequestAdditions } from "../../core/types";

export type ProfileRequest = Request<any,any,any,{ pid: string }
    & Record<string,string>>
    & { profile: Profile, user: User, profileRelations: UserWithProfileAndRelations, csrfToken: (() => string) }
    & RequestAdditions;
