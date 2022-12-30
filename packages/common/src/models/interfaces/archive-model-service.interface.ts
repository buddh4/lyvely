export interface IArchiveModelService<TID = string> {
  archive: (id: TID) => Promise<void>;
  unarchive: (id: TID) => Promise<void>;
}
