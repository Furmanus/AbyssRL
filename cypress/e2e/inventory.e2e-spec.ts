import type { LoadPageOptions } from '../support/e2e';

const loadPageOptions: LoadPageOptions = {
  dungeonDataFileName: 'roomWithWeapon.json',
  playerDataFileName: 'startingInventoryWithWeaponAndArmour.json',
};

describe('Inventory', () => {
  it('should visit and detect main container', () => {
    cy.loadPage(loadPageOptions).getApplicationElement('main-container');
  });

  it('should open inventory modal', () => {
    cy.loadPage(loadPageOptions).pressKey('i').getApplicationElement('inventory-modal-wrapper');
  });

  it('should close modal on overlay click', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey('i')
      .getApplicationElement('inventory-modal-wrapper')
      .get('body')
      .click(0, 0)
      .getApplicationElement('inventory-modal-wrapper')
      .should('not.exist');
  });

  it('should close modal on escape key', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey('i')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('esc')
      .getApplicationElement('inventory-modal-wrapper')
      .should('not.exist');
  });

  it('should equip weapon', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey('e')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('a')
      .getPlayerWeaponFromInventory(0)
      .then(weaponToEquip => {
        cy.getPlayerEquippedWeapon().then(equippedWeapon => {
          expect(equippedWeapon.id).to.equal(weaponToEquip.id);
        });
      });
  });

  it('should equip armour', () => {
    cy
      .loadPage(loadPageOptions)
      .pressKey('e')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('c')
      .getPlayerArmourFromInventory(0)
      .then(armourToEquip => {
        cy.getPlayerEquippedArmour().then(equippedArmour => {
          expect(equippedArmour.id).to.equal(armourToEquip.id);
        });
      });
  });

  it('should pick up item from floor', () => {
    let itemToPickUpId: string;

    cy
      .loadPage(loadPageOptions)
      .pressKey(['3', '2'])
      .getCurrentPlayerPosition()
      .getCurrentLevelCellInventory()
      .then((inventory) => {
        itemToPickUpId = inventory[0].id;
      })
      .pressKey(',')
      .getPlayerInventory()
      .then((inventory) => {
        expect(inventory.find((item) => item.id === itemToPickUpId)).to.not.be.undefined;
      })
      .getCurrentPlayerPosition()
      .getCurrentLevelCellInventory()
      .then((inventory) => {
        expect(inventory.length).to.equal(0);
      });
    ;
  });

  it('should multi drop items', () => {
    const itemsToDropIds: string[] = [];

    cy
      .loadPage(loadPageOptions)
      .getPlayerInventory()
      .then((inv) => {
        itemsToDropIds.push(inv[0].id);
        itemsToDropIds.push(inv[1].id)
      })
      .pressKey('d')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey(['a', 'b', 'enter'])
      .getCurrentPlayerPosition()
      .getCurrentLevelCellInventory()
      .then((inv) => {
        const areItemsOnGround = itemsToDropIds.every((droppedItem) => {
          return inv.find((item) => item.id === droppedItem);
        });

        expect(areItemsOnGround).to.equal(true);
      })
      .getPlayerInventory()
      .then((inventory) => {
        const areItemsInInventory = itemsToDropIds.every((droppedItem) => {
          return inventory.find((item) => item.id === droppedItem);
        });

        expect(areItemsInInventory).to.equal(false);
      })
  });
});
