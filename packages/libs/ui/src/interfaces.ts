import { Translatable } from '@/i18n';

export interface AvatarData {
  guid: string;
  timestamp?: number;
}

export interface ISelectOption {
  label: Translatable;
  value: string | number;
}

export type ISelectOptions = Array<ISelectOption>;
