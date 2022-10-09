/// <reference types="cypress" />

import { keyToKeyCodeMap } from '../helpers/keyboard';
import { LoadPageOptions } from './e2e';

Cypress.Commands.add('getApplicationElement', (name: string) => {
  return cy.get<HTMLElement>(`[data-test="${name}"]`);
});

Cypress.Commands.add('setRNGSeed', (value: number) => {
  cy.addListener('window:before:load', (window) => {
    window.env = {
      ...window.env,
      RNG_SEED: value,
    };
  });
});

Cypress.Commands.add('pressKey', (keyValue: string) => {
  cy.window().trigger('keydown', { which: keyToKeyCodeMap[keyValue], key: keyValue });
});

Cypress.Commands.add('loadPage', (opts: LoadPageOptions = {}) => {
  const { seed } = opts;

  cy.addListener('window:before:load', (window) => {
    window.env = {
      ...window.env,
      MODE: 'test',
    };
  });

  if (opts.seed) {
    cy.setRNGSeed(seed);
  }

  return cy.visit('/').getApplicationElement('test_element');
});
