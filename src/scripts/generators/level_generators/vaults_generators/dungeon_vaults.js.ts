import { RoomModel } from '../../../model/dungeon/room_model';
import { dungeonVaults } from '../../../constants/vaults';
import { cellTypes } from '../../../constants/cell_types';
import { LevelModel } from '../../../model/dungeon/level_model';
import { FloorModel } from '../../../model/dungeon/cells/floor_model';
import * as levelDecoratorHelper from '../../../helper/level_decorator_helper';
import { twoCellsArray } from '../../../helper/level_decorator_helper';

type generatorFunction = (room: RoomModel) => void;
interface INameToGeneratorFunctionMap {
    [prop: string]: generatorFunction;
}

export abstract class DungeonVaultsGenerator {
  public static generateRoomWithBed(room: RoomModel): boolean {
    if (room.hasStairsUp || room.hasStairsDown) {
      return false;
    }
    if (room.doorSpots.size > 1) {
      return false;
    }
    const roomLevelModel: LevelModel = room.getLevelModel();
    const bedCells: twoCellsArray = levelDecoratorHelper.getTwoRandomCellsAdjacentToWallsNotAdjacentToDoors(room);

    if (bedCells) {
      let barrelCell: FloorModel;
      roomLevelModel.changeCellType(bedCells[0].x, bedCells[0].y, cellTypes.BED_HEAD);
      roomLevelModel.changeCellType(bedCells[1].x, bedCells[1].y, cellTypes.BED_FOOT);

      barrelCell = levelDecoratorHelper.getRandomInteriorFloorCellAdjacentToWall(room);

      if (barrelCell) {
        roomLevelModel.changeCellType(barrelCell.x, barrelCell.y, cellTypes.CHEST_OF_DRAWERS);
      }

      return true;
    }
    return false;
  }

  public static generateRandomRoom(room: RoomModel): void {
    const randomGeneratorKey: string = Object.keys(nameToGeneratorFunctionMap).random();
    const randomGeneratorFunction: generatorFunction = nameToGeneratorFunctionMap[randomGeneratorKey];

    randomGeneratorFunction(room);
  }
}

export const nameToGeneratorFunctionMap: INameToGeneratorFunctionMap = {
  [dungeonVaults.ROOM_WITH_BED]: DungeonVaultsGenerator.generateRoomWithBed,
};
