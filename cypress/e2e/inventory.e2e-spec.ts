describe('Inventory', () => {
  it('should visit and detect main container', () => {
    cy.loadPage().getApplicationElement('main-container');
  });

  it('should open inventory modal', () => {
    cy.loadPage().pressKey('i').getApplicationElement('inventory-modal-wrapper');
  });

  it('should close modal on overlay click', () => {
    cy
      .loadPage()
      .pressKey('i')
      .getApplicationElement('inventory-modal-wrapper')
      .get('body')
      .click(0, 0)
      .getApplicationElement('inventory-modal-wrapper')
      .should('not.exist');
  });

  it('should close modal on escape key', () => {
    cy
      .loadPage()
      .pressKey('i')
      .getApplicationElement('inventory-modal-wrapper')
      .pressKey('esc')
      .getApplicationElement('inventory-modal-wrapper')
      .should('not.exist');
  });

  it('should equip weapon', () => {
    cy
      .loadPage()
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
});
