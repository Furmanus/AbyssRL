import { RoomModel } from '../../../models/room_model';
import { getRandomUnoccupiedCellAwayFromStairsAndDoors } from '../../../utils/levelDecorator.helper';
import { CellTypes } from '../../../constants/cellTypes.constants';

export function generateRoomWithBarrel(room: RoomModel): boolean {
  const barrelCell = getRandomUnoccupiedCellAwayFromStairsAndDoors(room);

  if (barrelCell) {
    room.changeCellType(barrelCell.x, barrelCell.y, CellTypes.Barrel);
  }

  return !!barrelCell;
}
