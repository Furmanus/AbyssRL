import { ItemTypes } from '../../src/scripts/items/constants/itemTypes.constants';
import type { WeaponModel } from '../../src/scripts/items/models/weapons/weapon.model';

Cypress.Commands.add('getPlayerData', () => {
  return cy.window().then((win) => win.applicationPlayerModel);
});

Cypress.Commands.add('getPlayerEquippedWeapon', () => {
  return cy.getPlayerData().then(model => model.equippedWeapon);
});

Cypress.Commands.add('getPlayerWeaponFromInventory', () => {
  return cy.getPlayerData().then(model => model.inventory.get().filter(item => item.itemType === ItemTypes.Weapon)[0] as WeaponModel);
})
