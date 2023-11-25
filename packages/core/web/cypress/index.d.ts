type Username = 'Jan' | 'Disabled';

declare namespace Cypress {
    interface Chainable {
        login(username: Username): void;
    }
}