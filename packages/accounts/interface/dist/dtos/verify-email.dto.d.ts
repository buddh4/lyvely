import { BaseModel } from '@lyvely/common';
export declare class VerifyEmailDto extends BaseModel<VerifyEmailDto> {
    email: string;
    otp: string;
}
