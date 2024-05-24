import { IconLibraryIF, IconProps } from '@/components/icons/interfaces/icon-library.interface';
import LySvgIcon from '@/components/icons/LySvgIcon.vue';

export const LyvelySvgIconLibrary: IconLibraryIF = {
  id: 'ly',
  component: LySvgIcon,
  getBindings: (props: IconProps) => props,
};
