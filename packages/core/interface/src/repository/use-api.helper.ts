import { useApiRepository } from './api.repository';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { EndpointResult } from '@/endpoints';
import { isObject } from 'lodash';

type ApiResponse<T, TClient> = T extends (...args: any) => any
  ? EndpointResult<T>
  : T extends keyof TClient
  ? TClient[T] extends (...args: any) => any
    ? EndpointResult<TClient[T]>
    : never
  : T;

type ResultType<TClient> = [undefined] extends [TClient] ? any : keyof TClient;

type ApiRequestConfig<D = any> = AxiosRequestConfig<D> & {
  skipAuthRefresh?: boolean;
  withCaptcha?: boolean;
  skipProfileIdParam?: boolean;
};

export const useApi = <TClient>(resource: string) => {
  return {
    /**
     * Sends a get request to the endpoint.
     *
     * Usage:
     *
     * get(path, config);
     * get(undefined, config);
     * get(path);
     * get(config)
     *
     * @param path
     * @param config
     */
    get: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      config = isObject(path) ? path : config;
      path = typeof path === 'string' ? path : undefined;
      return useApiRepository().get<T, R, D>(createPath(resource, path), config);
    },

    /**
     * Sends a delete request to the endpoint.
     *
     * Usage:
     *
     * delete(path, config);
     * delete(undefined, config);
     * delete(path);
     * delete(config)
     *
     * @param path
     * @param config
     */
    delete: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      config = isObject(path) ? path : config;
      path = typeof path === 'string' ? path : undefined;
      return useApiRepository().delete<T, R, D>(createPath(resource, path), config);
    },

    /**
     * Sends a head request to the endpoint.
     *
     * Usage:
     *
     * head(path, config);
     * head(undefined, config);
     * head(path);
     * head(config)
     *
     * @param path
     * @param config
     */
    head: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      config = isObject(path) ? path : config;
      path = typeof path === 'string' ? path : undefined;
      return useApiRepository().head<T, R, D>(createPath(resource, path), config);
    },

    /**
     * Sends an option request to the endpoint.
     *
     * Usage:
     *
     * option(path, config);
     * option(undefined, config);
     * option(path);
     * option(config)
     *
     * @param path
     * @param config
     */
    options: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      config = isObject(path) ? path : config;
      path = typeof path === 'string' ? path : undefined;
      return useApiRepository().options<T, R, D>(createPath(resource, path), config);
    },

    /**
     * Sends a post request to the endpoint.
     *
     * Usage:
     *
     * post(path, data, config);
     * post(path, data);
     * post(data);
     * post(data, config)
     * post(undefined, config);
     *
     * @param path
     * @param data
     * @param config
     */
    post: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      const {
        path: pathArg,
        data: dataArg,
        config: configArg,
      } = getArgsWithData<D>(path, data, config);
      return useApiRepository().post<T, ApiResponse<R, TClient>, D>(
        createPath(resource, pathArg),
        dataArg,
        configArg,
      );
    },

    /**
     * Sends a put request to the endpoint.
     *
     * Usage:
     *
     * put(path, data, config);
     * put(path, data);
     * put(data, config)
     * put(undefined, config);
     *
     * @param path
     * @param data
     * @param config
     */
    put: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      const {
        path: pathArg,
        data: dataArg,
        config: configArg,
      } = getArgsWithData<D>(path, data, config);
      return useApiRepository().put<T, ApiResponse<R, TClient>, D>(
        createPath(resource, pathArg),
        dataArg,
        configArg,
      );
    },

    /**
     * Sends a patch request to the endpoint.
     *
     * Usage:
     *
     * patch(path, data, config);
     * patch(path, data);
     * patch(data, config)
     * patch(undefined, config);
     *
     * @param path
     * @param data
     * @param config
     */
    patch: <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      const {
        path: pathArg,
        data: dataArg,
        config: configArg,
      } = getArgsWithData<D>(path, data, config);
      return useApiRepository().patch<T, ApiResponse<R, TClient>, D>(
        createPath(resource, pathArg),
        dataArg,
        configArg,
      );
    },
  };
};

function getArgsWithData<D = any>(
  path?: string | D,
  data?: D | ApiRequestConfig<D>,
  config?: ApiRequestConfig<D>,
): { path?: string; data?: D; config?: ApiRequestConfig<D> } {
  if (typeof path === 'string' || config) {
    return {
      path: path as string,
      data: data as D,
      config: config as ApiRequestConfig<D>,
    };
  }

  if (isObject(path)) {
    return {
      path: undefined,
      data: path,
      config: data as ApiRequestConfig<D>,
    };
  }

  if (data) {
    return {
      path: undefined,
      data: undefined,
      config: data,
    };
  }

  // Path is explicitly undefined post(undefined, data) post(undefined, data, config)
  return {
    path: undefined,
    data,
    config,
  };
}

function createPath(resource: string, path?: string) {
  resource = toRelative(resource);
  return path?.length ? resource + '/' + toRelative(path) : resource;
}

function toRelative(path: string) {
  return path.startsWith('/') ? path.substring(1) : path;
}
