import { Coordinates } from '../interfaces/interfaces';
import { convertPositionToCoordinatesString } from '../utils/utils';

Cypress.Commands.add('getDungeonData', { prevSubject: false }, () => {
  return cy.window().then((win) => win._application.dungeonState);
});

Cypress.Commands.add('getCurrentLevelCell', { prevSubject: false }, (coords: Coordinates) => {
  return cy.getDungeonData().then((state) => {
    const { currentBranch, currentLevelNumber, dungeonsStructure } = state;

    return dungeonsStructure[currentBranch][currentLevelNumber].cells.get(convertPositionToCoordinatesString(coords));
  });
});

Cypress.Commands.add('getCurrentLevelCellInventory', { prevSubject: 'optional' }, (coords: Coordinates) => {
  return cy.getCurrentLevelCell(coords).then((cell) => cell.inventory.get());
});

Cypress.Commands.add('getCurrentLevelCellContainerInventory', { prevSubject: 'optional' }, (coords: Coordinates) => {
  return cy.getCurrentLevelCell(coords).then((cell) => cell.containerInventory.get());
});

Cypress.Commands.add('getCurrentLevelData', () => {
  return cy.getDungeonData().then((data) => ({
    levelNumber: data.currentLevelNumber,
    branch: data.currentBranch,
  }));
});
