import { MonstersTypes } from '../../src/scripts/entity/constants/monsters';
import { ItemTypes } from '../../src/scripts/items/constants/itemTypes.constants';
import type { ArmourModel } from '../../src/scripts/items/models/armours/armour_model';
import type { WeaponModel } from '../../src/scripts/items/models/weapons/weapon.model';

Cypress.Commands.add('getPlayerData', () => {
  return cy.window().then((win) => win._application.playerModel);
});

Cypress.Commands.add('getPlayerHitPoints', () => {
  return cy.getPlayerData().then(playerModel => playerModel.hitPoints);
});

Cypress.Commands.add('getPlayerInventory', () => {
  return cy.getPlayerData().then(model => model.inventory.get());
});

Cypress.Commands.add('getPlayerEquippedWeapon', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.equippedWeapon);
});

Cypress.Commands.add('getPlayerEquippedArmour', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.equippedArmour);
});

Cypress.Commands.add('getPlayerWeaponFromInventory', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.inventory.get().filter(item => item.itemType === ItemTypes.Weapon)[0] as WeaponModel);
});

Cypress.Commands.add('getPlayerArmourFromInventory', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.inventory.get().filter(item => item.itemType === ItemTypes.Armour)[0] as ArmourModel);
});

Cypress.Commands.add('getCurrentPlayerCell', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.position);
});

Cypress.Commands.add('getCurrentPlayerPosition', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => ({ x: model.position.x, y: model.position.y }));
});

Cypress.Commands.add('getFirstEntityInPlayerFov', { prevSubject: false }, () => {
  return cy.getPlayerData().then(model => model.fov.find((cell) => cell.entity && cell.entity.type !== MonstersTypes.Player)?.entity || null);
});
