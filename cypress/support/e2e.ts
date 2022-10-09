// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

export type LoadPageOptions = {
  seed?: number;
}

declare global {
    namespace Cypress {
      interface Chainable {
        /**
         * Custom command to select DOM element by data-test attribute.
         */
         getApplicationElement(name: string): Chainable<JQuery<Element>>;
         setRNGSeed(value: number): Chainable<void>;
         pressKey(keyChar: string): Chainable<void>;
         loadPage(): Chainable<JQuery<Element>>;
      }
    }
  }
