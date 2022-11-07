import type { LoadPageOptions } from '../support/e2e';

const loadPageOptions: LoadPageOptions = {
  dungeonDataFileName: 'roomWithMonster.json',
  playerDataFileName: 'startingInventoryWithWeaponAndArmour.json',
};

describe('Combat', () => {
  it('should kill monster after equipping armour and weapon', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey('e')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('c')
      .pressKey('e')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('a')
      .getFirstEntityInPlayerFov()
      .its('type')
      .should('be.equal', 'giant_rat')
      .pressKey(new Array(20).fill('6'))
      .getFirstEntityInPlayerFov()
      .should('not.be.ok');
  });
  it('monster should kill player doing nothing', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey(new Array(20).fill('.'))
      .getPlayerData()
      .its('hitPoints')
      .should('be.lte', 0);
  });
});
