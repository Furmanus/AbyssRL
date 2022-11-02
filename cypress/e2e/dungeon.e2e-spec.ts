import { LoadPageOptions } from '../support/e2e';

const loadPageOptions: LoadPageOptions = {
  dungeonDataFileName: 'roomWithBarrelAndDoors.json',
  playerDataFileName: 'startingInventoryWithWeaponAndArmour.json',
};

describe('Dungeon features', () => {
  it('should insert items into container', () => {
    let startingInventoryItemsIds: string[];

    cy
      .loadPage(loadPageOptions)
      .getPlayerInventory()
      .then((inv) => {
        startingInventoryItemsIds = inv.map((item) => item.id);
      })
      .pressKey(['a', '2'])
      .get('#modal-content [data-element="list"]')
      .get('[data-element="putActionButton"]')
      .click()
      .pressKey(['a', 'b', 'c', 'd', 'Enter'])
      .getPlayerInventory()
      .its('length')
      .should('be.equal', 0);

    cy
      .wrap({ x: 3, y: 3 })
      .getCurrentLevelCellContainerInventory()
      .should((inv) => {
        expect(inv.map((item) => item.id)).to.include.members(startingInventoryItemsIds);
      });
  });
});
