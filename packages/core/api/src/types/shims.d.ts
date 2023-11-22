declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
    withCaptcha?: boolean;
    skipProfileIdParam?: boolean;
  }
}
