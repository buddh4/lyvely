type Username = 'Jan' | 'Disabled';

declare namespace Cypress {
    interface Chainable {
        authenticatedAs(username: Username): void;
        getId<K extends keyof HTMLElementTagNameMap>(dataId: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>): Chainable<JQuery<HTMLElementTagNameMap[K]>>
    }
}