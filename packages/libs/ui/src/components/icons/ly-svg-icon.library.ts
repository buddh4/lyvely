import { IconLibraryIF, IconPropsIF } from './icon-library.interface';
import LySvgIcon from './LySvgIcon.vue';

export const LyvelySvgIconLibrary: IconLibraryIF = {
  id: 'ly',
  component: LySvgIcon,
  getBindings: (props: IconPropsIF) => props,
};
