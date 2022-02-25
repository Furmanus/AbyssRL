import { RoomModel } from '../../models/room_model';
import { DungeonVaults } from '../constants/vaults.constants';
import { CellTypes } from '../../constants/cellTypes.constants';
import { LevelModel } from '../../models/level_model';
import * as levelDecoratorHelper from '../../utils/levelDecorator.helper';
import { twoCellsArray } from '../../utils/levelDecorator.helper';
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
