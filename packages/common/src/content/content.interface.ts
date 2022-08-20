export interface IContent<TID = any> {
    id: string;
    type: string;
    title?: string;
    visibility: number;
    text?: string;
    archived: boolean;
    tagIds: TID[];
}
