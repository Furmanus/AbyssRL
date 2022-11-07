import { LoadPageOptions } from '../support/e2e';

const loadPageOptions: LoadPageOptions = {
  dungeonDataFileName: 'roomWithBarrelAndDoors.json',
  playerDataFileName: 'startingInventoryWithWeaponAndArmour.json',
};
const loadPageBarrelLevel = {
  dungeonDataFileName: 'roomWithBarrelAndDoors.json',
  playerDataFileName: 'startingInventoryEmpty.json',
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
  it('should withdraw items from container', () => {
    let containerInventoryItemsIds: string[];

    cy
      .loadPage(loadPageBarrelLevel)
      .wrap({ x: 4, y: 4 })
      .getCurrentLevelCellContainerInventory()
      .then((inv) => {
        containerInventoryItemsIds = inv.map((item) => item.id);
      })
      .pressKey(['3', 'a', '2'])
      .get('#modal-content [data-element="list"]')
      .get('[data-element="takeActionButton"]')
      .click()
      .pressKey(['a', 'b', 'Enter'])
      .getPlayerInventory()
      .should((inv) => {
        expect(inv.map((item) => item.id)).to.include.members(containerInventoryItemsIds);
      })
      .wrap({ x: 4, y: 4 })
      .getCurrentLevelCellContainerInventory()
      .its('length')
      .should('be.equal', 0);
  });
  it('should descend stairs down and back upwards', () => {
    cy
      .loadPage(loadPageBarrelLevel)
      .pressKey(['3', '3'])
      .pressShift()
      .pressKey(['.'])
      .releaseShift()
      .getCurrentLevelData()
      .its('levelNumber')
      .should('be.equal', 2)
      .pressShift()
      .pressKey([','])
      .releaseShift()
      .getCurrentLevelData()
      .its('levelNumber')
      .should('be.equal', 1);
  });
  it('should open and close doors', () => {
    cy
      .loadPage(loadPageBarrelLevel)
      .pressKey(['6', '6', '6'])
      .assertIfCellIsVisibleByPlayer(7, 2)
      .pressKey(['a', '6'])
      .assertIfCellIsNotVisibleByPlayer(7, 2);
  });
});
