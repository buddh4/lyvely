import { Expose } from 'class-transformer';
import { BaseModel } from '@/models';
import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { IStreamFilter } from '@/stream';

@Expose()
export class ContentStreamFilter extends BaseModel<ContentStreamFilter> implements IStreamFilter {
  @IsMongoId()
  @IsOptional()
  parent?: string;

  @IsBoolean()
  @IsOptional()
  archived?: boolean;

  @IsString()
  @IsOptional()
  query?: string;

  @IsMongoId({ each: true })
  @IsOptional()
  tagIds?: Array<string>;

  toggleTag(id: string) {
    if (this.isActiveTag(id)) {
      this.removeTagId(id);
    } else {
      this.addTagId(id);
    }
  }

  isActiveTag(id: string) {
    return this.tagIds?.find((tid) => tid === id);
  }

  setTagIds(...ids: string[]) {
    this.tagIds = ids;
  }

  addTagId(id: string) {
    if (!this.tagIds) {
      this.tagIds = [];
    }

    this.tagIds.push(id);
  }

  removeTagId(id: string) {
    if (!this.tagIds) return;
    const tagIndex = this.tagIds.findIndex((tid) => id === tid);
    if (tagIndex === -1) return;
    this.tagIds.splice(tagIndex, 1);
  }

  isEmpty() {
    return !!this.tagIds?.length;
  }

  reset() {
    // parent filter needs to be reset manually
  }
}
