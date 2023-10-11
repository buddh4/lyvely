export function isDevelopEnvironment() {
  return import.meta.env.VITE_APP_ENV === 'development';
}
