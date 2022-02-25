export function includesUtilityClass(classNames: string, prefix: string) {
  return new RegExp(`^.*${prefix}-\\d`).test(classNames);
}
