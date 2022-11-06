/// <reference types="cypress" />

import { keyToKeyCodeMap } from '../helpers/keyboard';
import { PressKeyOptions } from '../interfaces/interfaces';
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

Cypress.Commands.add('pressKey', (keyValue: string | string[], options: PressKeyOptions = {}) => {
  const { shiftKey, key: keyString } = options;
  let keys = keyValue;

  if (!Array.isArray(keyValue)) {
    keys = [keyValue];
  }

  for (const key of keys) {
    cy.window().trigger('keydown', { which: keyToKeyCodeMap[key], key: keyString || key, shiftKey });
  }
});

Cypress.Commands.add('pressShift', () => {
  cy.window().trigger('keydown', {
    key: 'Shift',
    keyCode: 16,
    which: 16,
    code: 'ShiftLeft',
    repeat: true
  });
});

Cypress.Commands.add('releaseShift', () => {
  cy.window().trigger('keyup', {
    key: 'Shift',
    keyCode: 16,
    which: 16,
    code: 'ShiftLeft',
    repeat: false
  });
});

Cypress.Commands.add('loadPage', (opts: LoadPageOptions = {}) => {
  const { seed, dungeonDataFileName, playerDataFileName } = opts;

  cy.addListener('window:before:load', (window) => {
    window.env = {
      ...window.env,
      MODE: 'test',
      ...(dungeonDataFileName && { TEST_DUNGEON_DATA: dungeonDataFileName }),
      ...(playerDataFileName && { TEST_PLAYER_DATA: playerDataFileName }),
    };
  });

  if (opts.seed) {
    cy.setRNGSeed(seed);
  }

  return cy.visit('/').getApplicationElement('test_element');
});
