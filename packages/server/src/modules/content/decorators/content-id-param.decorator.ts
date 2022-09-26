import { SetMetadata } from '@nestjs/common';
import { CONTENT_ID_PARAM_KEY } from "../guards";

export const ContentIdParam = (contentIdParamName: string) => SetMetadata(CONTENT_ID_PARAM_KEY, contentIdParamName);
