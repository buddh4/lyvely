import { BaseModel } from '@/models';
import { Expose } from 'class-transformer';

@Expose()
export class FeatureSyncModel extends BaseModel<FeatureSyncModel> {
  updatedAt: number;
  loadedAt: number;

  constructor(feature: string) {
    const ts = Date.now();
    super({
      updatedAt: ts,
    });
  }

  loaded() {
    this.loadedAt = Date.now();
  }

  updatesAvailable() {
    return !this.loadedAt || this.loadedAt < this.updatedAt;
  }
}
