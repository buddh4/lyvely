import RequestOptions = Cypress.RequestOptions;

type Username = 'owner' | 'disabled' | 'moderator' | 'member' | 'no-member';

type APIRequestOptions = RequestOptions & {
  apiVersion?: string;
  as?: Username;
};

declare namespace Cypress {
  interface Chainable {
    authenticatedAs(username: Username): void;
    isForbidden(path?: string, options?: Partial<VisitOptions>): void;
    load(path: string, options?: Partial<VisitOptions>): void;
    logout(): void;
    apiRequest<T = any>(
      path: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    apiPost<T = any>(
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    apiGet<T = any>(path?: string, options?: Partial<APIRequestOptions>): Chainable<Response<T>>;
    apiPut<T = any>(
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    apiPatch<T = any>(
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    apiDelete<T = any>(
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiRequest<T = any>(
      handle: string,
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiPost<T = any>(
      handle: string,
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiGet<T = any>(
      handle: string,
      path?: string,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiPut<T = any>(
      handle: string,
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiPatch<T = any>(
      handle: string,
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    profileApiDelete<T = any>(
      handle: string,
      path?: string,
      body?: RequestBody,
      options?: Partial<APIRequestOptions>,
    ): Chainable<Response<T>>;
    loadProfile(handle: string, path?: string, options?: Partial<VisitOptions>): void;
    getId<K extends keyof HTMLElementTagNameMap>(
      dataId: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Chainable<JQuery<HTMLElementTagNameMap[K]>>;
    getByObjectId<K extends keyof HTMLElementTagNameMap>(
      seed: string,
      prefix?: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>,
    ): Chainable<JQuery<HTMLElementTagNameMap[K]>>;
  }
}
