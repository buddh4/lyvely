export interface IArchivable {
  archived?: boolean;
}

export interface IArchiveModelClient<TID = string> {
  archive: (id: TID) => Promise<boolean>;
  restore: (id: TID) => Promise<boolean>;
}
