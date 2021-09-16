import { RoomModel } from '../../../model/dungeon/room_model';
import { DungeonVaults } from '../../../constants/vaults';
import { cellTypes } from '../../../constants/cell_types';
import { LevelModel } from '../../../model/dungeon/level_model';
import * as levelDecoratorHelper from '../../../helper/level_decorator_helper';
import { twoCellsArray } from '../../../helper/level_decorator_helper';
import {
  generateRoomWithBarrel,
  generateRoomWithBed,
} from './vaults_functions';

type GeneratorFunction = (room: RoomModel) => void;

export abstract class DungeonVaultsGenerator {
  public static generateRoomWithBed = generateRoomWithBed;
  public static generateRoomWithBarrel = generateRoomWithBarrel;

  public static generateRandomRoom(room: RoomModel): void {
    // TODO sprawdz config czy dev opcja z wybranymi vaultami jest obecna, jak tak to zmodyfikuj logike by bral tylko zaznaczone opcje pod uwage
    const randomGeneratorKey: string = Object.keys(
      nameToGeneratorFunctionMap,
    ).random();
    const randomGeneratorFunction: GeneratorFunction =
      nameToGeneratorFunctionMap[randomGeneratorKey as DungeonVaults];

    randomGeneratorFunction(room);
  }
}

export const nameToGeneratorFunctionMap: Record<
  DungeonVaults,
  GeneratorFunction
> = {
  [DungeonVaults.RoomWithBed]: DungeonVaultsGenerator.generateRoomWithBed,
  [DungeonVaults.RoomWithBarrel]: DungeonVaultsGenerator.generateRoomWithBarrel,
};
