import { DocumentModel } from "@/models";
import { Expose, Exclude } from 'class-transformer';
import randomColor from "randomcolor";

@Exclude()
export class TagModel extends DocumentModel<TagModel> {
  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  description?: string;

  @Expose()
  archived?: boolean;

  @Expose()
  includeOnFilter?: boolean;

  constructor(obj?: Partial<TagModel>) {
    super(obj);
    this.color = this.color || randomColor({ luminosity: 'dark' })
  }
}
