import { RoomModel } from '../../../../model/dungeon/room_model';
import { getRandomUnoccupiedCellAwayFromStairsAndDoors } from '../../../../helper/level_decorator_helper';
import { cellTypes } from '../../../../constants/cells/cell_types';

export function generateRoomWithBarrel(room: RoomModel): boolean {
  const barrelCell = getRandomUnoccupiedCellAwayFromStairsAndDoors(room);

  if (barrelCell) {
    room.changeCellType(barrelCell.x, barrelCell.y, cellTypes.BARREL);
  }

  return !!barrelCell;
}
