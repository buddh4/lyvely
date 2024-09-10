import type { IAvatar } from '@/interfaces';
import type { IconBindingsIF } from '@/components/icons';

/**
 * Represents the configuration of a single picker option.
 */
export interface IPickerOption {
  /** The key of a picker option, used as setting. **/
  key: string;
  /** The label of a picker option. Can alternatively be provided by the 'labels' property. **/
  label: string;
  /** Optional descriptive short text of the item. **/
  description?: string;
  /** The color of the badge. **/
  color?: string;
  /** Optional avatar, which can not be mixed with icons. **/
  avatar?: IAvatar;
  /** Optional icon, which can not be mixed with avatars. **/
  icon?: string;
  /** Optional icon bindings, which can be used instead of plain icon string. **/
  iconBindings?: IconBindingsIF;
}
