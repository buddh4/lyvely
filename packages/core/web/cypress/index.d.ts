type Username = 'Jan' | 'Disabled' | 'Peter' | 'no-member';

declare namespace Cypress {
  interface Chainable {
    authenticatedAs(username: Username): void;
    isForbidden(path?: string, options?: Partial<VisitOptions>): void;
    load(path: string, options?: Partial<VisitOptions>): void;
    logout(): void;
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
