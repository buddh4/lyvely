import { ClsStore } from 'nestjs-cls';

export interface TenancyStore extends ClsStore {
  tenancyId?: string;
}
