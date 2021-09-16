import { Cell } from '../model/dungeon/cells/cell_model';
import { RoomModel } from '../model/dungeon/room_model';
import { LevelModel } from '../model/dungeon/level_model';
import { cellTypes } from '../constants/cell_types';

export type twoCellsArray = [Cell, Cell];

function isCellAdjacentToDoorsTest(cell: Cell): boolean {
  return cell.type.includes('doors');
}
function isCellAdjacentToWallTest(cell: Cell): boolean {
  return cell.type.includes('wall');
}
function isCellAdjacentToStairsTest(cell: Cell): boolean {
  return (
    cell.type.includes(cellTypes.STAIRS_DOWN) ||
    cell.type.includes(cellTypes.STAIRS_UP)
  );
}
export function getRandomInteriorFloorCellAdjacentToWall(
  room: RoomModel,
): Cell {
  const roomLevelModel: LevelModel = room.getLevelModel();

  return room.getRandomCallbackCell((cellCandidate: Cell) => {
    if (
      !roomLevelModel.isCellAdjacentToCell(
        cellCandidate,
        isCellAdjacentToWallTest,
      )
    ) {
      return false;
    }
    if (
      roomLevelModel.isCellAdjacentToCell(
        cellCandidate,
        isCellAdjacentToDoorsTest,
      )
    ) {
      return false;
    }
    return cellCandidate.type.includes('floor');
  });
}
export function getTwoRandomCellsAdjacentToWallsNotAdjacentToDoors(
  room: RoomModel,
): twoCellsArray {
  const roomLevelModel: LevelModel = room.getLevelModel();
  let secondCell: Cell;
  const firstCell: Cell = room.getRandomCallbackCell((cellCandidate: Cell) => {
    if (cellCandidate.blockMovement) {
      return false;
    }

    const cellCandidateNeighbour: Cell = roomLevelModel.getCell(
      cellCandidate.x + 1,
      cellCandidate.y,
    );

    if (cellCandidateNeighbour.blockMovement) {
      return false;
    }
    // check if cell and its neighbour are not adjacent to doors and adjacent to wall
    return (
      (!roomLevelModel.isCellAdjacentToCell(
        cellCandidate,
        isCellAdjacentToDoorsTest,
      ) ||
        !roomLevelModel.isCellAdjacentToCell(
          cellCandidateNeighbour,
          isCellAdjacentToDoorsTest,
        )) &&
      roomLevelModel.isCellAdjacentToCell(
        cellCandidate,
        isCellAdjacentToWallTest,
      ) &&
      roomLevelModel.isCellAdjacentToCell(
        cellCandidateNeighbour,
        isCellAdjacentToWallTest,
      )
    );
  });
  if (firstCell) {
    secondCell = roomLevelModel.getCell(firstCell.x + 1, firstCell.y);

    return [firstCell, secondCell];
  }
}

export function getRandomUnoccupiedCellAwayFromStairsAndDoors(
  room: RoomModel,
): Cell {
  const levelModel = room.getLevelModel();
  const targetCell = room.getRandomCallbackCell((cellCandidate) => {
    const isFloor = cellCandidate.type.match(/floor/);
    const isAdjacentToDoors = levelModel.isCellAdjacentToCell(
      cellCandidate,
      isCellAdjacentToDoorsTest,
    );
    const isAdjacentToStairs = levelModel.isCellAdjacentToCell(
      cellCandidate,
      isCellAdjacentToStairsTest,
    );

    if (!isFloor || isAdjacentToDoors || isAdjacentToStairs) {
      return false;
    }

    return true;
  });

  return targetCell;
}
