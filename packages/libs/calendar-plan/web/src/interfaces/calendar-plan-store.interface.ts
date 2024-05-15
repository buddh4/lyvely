export interface IMoveEntryEvent {
  cid: string;
  fromInterval: number;
  toInterval: number;
  newIndex: number;
  oldIndex: number;
}
