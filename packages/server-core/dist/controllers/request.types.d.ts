import { Request } from 'express';
export type RequestAdditions = {
    csrfToken: () => string;
};
export type LyvelyRequest = Request & RequestAdditions;
