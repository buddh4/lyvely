export interface ICrudModel<TUpdateModel> {
  toEditModel(): TUpdateModel;
}
