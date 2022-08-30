import { Expose } from 'class-transformer';

@Expose()
export class UpdateTaskStateResultDto {
  score: number;
  done: string;

  constructor(obj: Partial<UpdateTaskStateResultDto>) {
    Object.assign(this, obj);
  }
}
