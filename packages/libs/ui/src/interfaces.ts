import { Translatable } from '@/i18n';

export interface IAvatarData {
  guid: string;
  timestamp?: number;
}

export interface ISelectOption {
  label: Translatable;
  value: string | number;
  group?: { id: string; label: string };
}

export type ISelectOptions = Array<ISelectOption>;
