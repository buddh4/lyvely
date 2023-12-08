import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosInterceptorOptions,
} from 'axios';
import { IntegrityException, MisconfigurationException } from '@/exceptions';

let _repository: AxiosInstance | undefined;
let _options: IRepositoryOptions = {
  apiUrl: 'http://127.0.0.1:8080/api',
};

type AxiosInterceptorOnFulfilled<V> = (value: V) => V | Promise<V>;
type AxiosInterceptorOnRejected = ((error: any) => any) | null;

export interface IRepositoryOptions {
  apiUrl: string;
}

export function initApiRepository(options: IRepositoryOptions) {
  if (_repository) throw new IntegrityException('Can not overwrite api repository');
  _options = options;
  const baseURL = options.apiUrl || 'http://127.0.0.1:8080/api';
  console.debug(`Use api url ${baseURL}`);
  _repository = axios.create({ baseURL, withCredentials: true });
}

export function useApiRepository() {
  if (!_repository) {
    throw new MisconfigurationException('getRepository called before initRepository.');
  }

  return _repository;
}

export function useApiRequestInterceptor(
  onFulfilled?: AxiosInterceptorOnFulfilled<InternalAxiosRequestConfig>,
  onRejected?: AxiosInterceptorOnRejected,
  options?: AxiosInterceptorOptions,
): number {
  if (!_repository) {
    throw new MisconfigurationException('getRepository called before useApiRequestInterceptor.');
  }
  return _repository.interceptors.request.use(onFulfilled, onRejected, options);
}

export function useApiResponseInterceptor(
  onFulfilled?: AxiosInterceptorOnFulfilled<AxiosResponse>,
  onRejected?: AxiosInterceptorOnRejected,
  options?: AxiosInterceptorOptions,
): number {
  if (!_repository) {
    throw new MisconfigurationException('getRepository called before useApiResponseInterceptor.');
  }
  return _repository.interceptors.response.use(onFulfilled, onRejected, options);
}

export function createApiUrl(path: string, queryParameters: Record<string, string> = {}) {
  if (!_options.apiUrl) {
    throw new MisconfigurationException('createApiUrl called before initRepository.');
  }

  const url = new URL(_options.apiUrl);
  path = path.charAt(0) === '/' ? path : '/' + path;
  url.pathname = path;

  Object.keys(queryParameters).forEach((key) => {
    url.searchParams.append(key, queryParameters[key]);
  });

  return url.toString();
}
