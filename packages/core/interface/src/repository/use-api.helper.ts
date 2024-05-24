import { useApiRepository } from './api.repository';
import { AxiosResponse, AxiosRequestConfig } from 'axios';
import { EndpointResult, setProfileApiPrefix } from '@/endpoints';
import { isPlainObject } from '@lyvely/common';
import { errorToServiceException } from '@/exceptions';
import { Headers } from '@/common';

export const DEFAULT_API_VERSION = '1';

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
  pid?: string;
};

export const useApi = <TClient>(resource: string, version?: string) => {
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
     * @throws ServiceException
     */
    get: async <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        config = (isPlainObject(path) ? path : config) || {};
        path = typeof path === 'string' ? path : undefined;
        return await useApiRepository().get<T, R, D>(
          createPath(resource, path, config),
          prepareConfig(config, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    delete: async <
      T extends ResultType<TClient>,
      R = AxiosResponse<ApiResponse<T, TClient>>,
      D = any,
    >(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        config = isPlainObject(path) ? path : config;
        path = typeof path === 'string' ? path : undefined;
        return await useApiRepository().delete<T, R, D>(
          createPath(resource, path, config),
          prepareConfig(config, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    head: async <
      T extends ResultType<TClient>,
      R = AxiosResponse<ApiResponse<T, TClient>>,
      D = any,
    >(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        config = isPlainObject(path) ? path : config;
        path = typeof path === 'string' ? path : undefined;
        return await useApiRepository().head<T, R, D>(
          createPath(resource, path, config),
          prepareConfig(config, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    options: async <
      T extends ResultType<TClient>,
      R = AxiosResponse<ApiResponse<T, TClient>>,
      D = any,
    >(
      path?: string | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        config = isPlainObject(path) ? path : config;
        path = typeof path === 'string' ? path : undefined;
        return await useApiRepository().options<T, R, D>(
          createPath(resource, path, config),
          prepareConfig(config, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    post: async <
      T extends ResultType<TClient>,
      R = AxiosResponse<ApiResponse<T, TClient>>,
      D = any,
    >(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        const {
          path: pathArg,
          data: dataArg,
          config: configArg,
        } = getArgsWithData<D>(path, data, config);
        return await useApiRepository().post<T, ApiResponse<R, TClient>, D>(
          createPath(resource, pathArg, config),
          dataArg,
          prepareConfig(configArg, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    put: async <T extends ResultType<TClient>, R = AxiosResponse<ApiResponse<T, TClient>>, D = any>(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        const {
          path: pathArg,
          data: dataArg,
          config: configArg,
        } = getArgsWithData<D>(path, data, config);
        return await useApiRepository().put<T, ApiResponse<R, TClient>, D>(
          createPath(resource, pathArg, config),
          dataArg,
          prepareConfig(configArg, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
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
     * @throws ServiceException
     */
    patch: async <
      T extends ResultType<TClient>,
      R = AxiosResponse<ApiResponse<T, TClient>>,
      D = any,
    >(
      path?: string | D,
      data?: D | ApiRequestConfig<D>,
      config?: ApiRequestConfig<D>,
    ) => {
      try {
        const {
          path: pathArg,
          data: dataArg,
          config: configArg,
        } = getArgsWithData<D>(path, data, config);
        return await useApiRepository().patch<T, ApiResponse<R, TClient>, D>(
          createPath(resource, pathArg, config),
          dataArg,
          prepareConfig(configArg, version),
        );
      } catch (e) {
        throw errorToServiceException(e);
      }
    },
  };
};

function prepareConfig(config?: ApiRequestConfig, version = DEFAULT_API_VERSION) {
  config ??= {};
  config.headers ??= {};
  config.headers[Headers.X_API_VERSION] = version;
  return config;
}

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

  if (isPlainObject(path)) {
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

function createPath(resource: string, path?: string, config?: ApiRequestConfig) {
  resource = toRelative(resource);
  return setProfileApiPrefix(
    path?.length ? resource + '/' + toRelative(path) : resource,
    config?.pid,
  );
}

function toRelative(path: string) {
  return path.startsWith('/') ? path.substring(1) : path;
}
