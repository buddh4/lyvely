export class MoveActivityDto {
  oldIndex: number;
  newIndex: number;

  constructor(obj?: Partial<MoveActivityDto>) {
    if(obj) {
      this.oldIndex = obj.oldIndex;
      this.newIndex = obj.newIndex;
    }
  }
}