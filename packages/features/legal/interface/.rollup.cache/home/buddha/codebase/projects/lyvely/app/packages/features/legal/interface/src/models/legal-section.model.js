import { __decorate } from "tslib";
import { BaseModel } from '@lyvely/common';
import { Expose } from 'class-transformer';
let LegalSection = class LegalSection extends BaseModel {
};
LegalSection = __decorate([
    Expose()
], LegalSection);
export { LegalSection };
let LegalSectionDetails = class LegalSectionDetails extends LegalSection {
};
LegalSectionDetails = __decorate([
    Expose()
], LegalSectionDetails);
export { LegalSectionDetails };
