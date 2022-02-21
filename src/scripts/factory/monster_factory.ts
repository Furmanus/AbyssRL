import { Cell } from '../model/dungeon/cells/cell_model';
import { MonsterController } from '../controller/entity/monster_controller';
import { MonsterModel } from '../model/entity/monster_model';
import { Monsters, MonstersTypes } from '../constants/entity/monsters';
import { Position, SerializedPosition } from '../model/position/position';
import { dungeonState } from '../state/application.state';
import { NaturalWeaponFactory } from './natural_weapon_factory';
import { SerializedEntityModel } from '../model/entity/entity_model';
import { entityRegistry } from '../global/entityRegistry';

const partialDefaultMonsterConfig = {
  strength: 0,
  dexterity: 0,
  toughness: 0,
  intelligence: 0,
  perception: 0,
  speed: 0,
  protection: 0,
};

export class MonsterFactory {
  public static getMonsterControllerByType(
    type: Monsters,
    startingPosition: SerializedPosition,
    serializedData?: SerializedEntityModel,
  ): MonsterController {
    if (type in monsterTypeToFactoryMethod) {
      return monsterTypeToFactoryMethod[type](startingPosition, serializedData);
    }

    throw new Error('Invalid monster type');
  }

  public static getGiantRatController(
    startingPosition: SerializedPosition,
    serializedData?: SerializedEntityModel,
  ): MonsterController {
    const controller = new MonsterController({
      model: new MonsterModel({
        type: MonstersTypes.GiantRat,
        position: {
          branch: dungeonState.currentBranch,
          level: dungeonState.currentLevelNumber,
          position: new Position(startingPosition.x, startingPosition.y),
        },
        entityStatuses: [],
        ...partialDefaultMonsterConfig,
        ...serializedData,
      }),
    });

    entityRegistry.addEntry(controller.getModel(), controller);

    return controller;
  }
}

const monsterTypeToFactoryMethod = {
  [Monsters.GiantRat]: MonsterFactory.getGiantRatController,
};
