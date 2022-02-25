export interface IContent {
    id: string;
    type: string;
    title?: string;
    visibility: number;
    text?: string;
    archived: boolean;
    categories: string[];
}