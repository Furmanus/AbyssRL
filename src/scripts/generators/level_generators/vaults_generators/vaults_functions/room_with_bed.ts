import { RoomModel } from '../../../../model/dungeon/room_model';
import { LevelModel } from '../../../../model/dungeon/level_model';
import { twoCellsArray } from '../../../../helper/level_decorator_helper';
import * as levelDecoratorHelper from '../../../../helper/level_decorator_helper';
import { cellTypes } from '../../../../constants/cells/cell_types';

export function generateRoomWithBed(room: RoomModel): boolean {
  if (room.hasStairsUp || room.hasStairsDown) {
    return false;
  }
  if (room.doorSpots.size > 1) {
    return false;
  }
  const roomLevelModel: LevelModel = room.getLevelModel();
  const bedCells: twoCellsArray =
    levelDecoratorHelper.getTwoRandomCellsAdjacentToWallsNotAdjacentToDoors(
      room,
    );

  if (bedCells) {
    roomLevelModel.changeCellType(
      bedCells[0].x,
      bedCells[0].y,
      cellTypes.BED_HEAD,
    );
    roomLevelModel.changeCellType(
      bedCells[1].x,
      bedCells[1].y,
      cellTypes.BED_FOOT,
    );

    const barrelCell =
      levelDecoratorHelper.getRandomInteriorFloorCellAdjacentToWall(room);

    if (barrelCell) {
      roomLevelModel.changeCellType(
        barrelCell.x,
        barrelCell.y,
        cellTypes.CHEST_OF_DRAWERS,
      );
    }

    return true;
  }
  return false;
}
