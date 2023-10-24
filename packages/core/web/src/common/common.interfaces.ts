export interface IDragEvent {
  from: HTMLElement;
  to: HTMLElement;
  item: HTMLElement;
  oldIndex: number;
  newIndex: number;
}
