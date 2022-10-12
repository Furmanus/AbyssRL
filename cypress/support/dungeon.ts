import { Coordinates } from '../interfaces/interfaces';
import { convertPositionToCoordinatesString } from '../utils/utils';

Cypress.Commands.add('getDungeonData', { prevSubject: false }, () => {
  return cy.window().then((win) => win._application.dungeonState);
});

Cypress.Commands.add('getCurrentLevelCell', { prevSubject: false }, (coords: Coordinates) => {
  return cy.getDungeonData().then((state) => {
    const { currentBranch, currentLevelNumber, dungeonsStructure } = state;
    console.log(convertPositionToCoordinatesString(coords))
    console.log(dungeonsStructure[currentBranch][currentLevelNumber].cells);

    return dungeonsStructure[currentBranch][currentLevelNumber].cells.get(convertPositionToCoordinatesString(coords));
  });
});

Cypress.Commands.add('getCurrentLevelCellInventory', { prevSubject: 'optional' }, (coords: Coordinates) => {
  return cy.getCurrentLevelCell(coords).then((cell) => cell.inventory.get());
});
