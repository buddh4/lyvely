import dayjs from "dayjs";

import de from "dayjs/locale/de";

export default function init(): void {
  // TODO: only load user locales
  dayjs.locale(de);
}
