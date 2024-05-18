/**
 * Helper function to check if a certain token of the format {{ENV_VARIABLE_NAME}} was replaced with an actual value by
 * some build step e.g. in a docker build.
 * @param tokenOrValue
 * @param defaultVal
 */
export function getInjectedEnv<TReturn = string>(
  tokenOrValue: string,
  defaultVal: TReturn,
): TReturn {
  return /^{{[a-zA-Z0-9_]+}}$/.test(tokenOrValue) ? defaultVal : (tokenOrValue as TReturn);
}
