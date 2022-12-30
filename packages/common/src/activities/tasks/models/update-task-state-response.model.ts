import { Expose } from 'class-transformer';

@Expose()
export class UpdateTaskStateResponse {
  score: number;
  done: string;

  constructor(obj: Partial<UpdateTaskStateResponse>) {
    Object.assign(this, obj);
  }
}
