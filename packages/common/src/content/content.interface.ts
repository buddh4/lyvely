export interface IContent<TID = string> {
    id: string;
    type: string;
    title?: string;
    visibility: number;
    text?: string;
    archived: boolean;
    tagIds: TID[];
}