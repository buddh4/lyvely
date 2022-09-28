import dayjs from "dayjs";

import de from "dayjs/locale/de";

export default function init(): void {
  // TODO: only load user locales
  dayjs.locale(de);
}

export function getDefaultLocale() {
  // TODO: validate locale if supported
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
}
