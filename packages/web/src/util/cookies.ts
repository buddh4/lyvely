import Cookies from "js-cookie";

export function getCookie(key: string) {
  return Cookies.get(key);
}
