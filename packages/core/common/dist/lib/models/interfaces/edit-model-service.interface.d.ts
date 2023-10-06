export interface IEditModelService<TResponse, TCreateModel, TUpdateModel = Partial<TCreateModel>, TID = string> {
    create: (model: TCreateModel) => Promise<TResponse>;
    update: (id: TID, model: TUpdateModel) => Promise<TResponse>;
}
