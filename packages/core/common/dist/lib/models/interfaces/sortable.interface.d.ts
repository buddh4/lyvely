import { BaseModel } from '../base.model';
export interface ISortable {
    getSortOrder(): number | undefined;
}
export declare class SortResult extends BaseModel<SortResult> {
    id: string;
    sortOrder: number;
}
export declare class SortResponse extends BaseModel<SortResponse> {
    sort: SortResult[];
}
export declare function sortBySortOrder(a: ISortable, b: ISortable): number;
