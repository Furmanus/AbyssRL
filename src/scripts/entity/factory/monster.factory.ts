import { Cell } from '../../dungeon/models/cells/cell_model';
import { MonsterEntity } from '../controllers/monster.entity';
import { MonsterModel } from '../models/monster.model';
import { Monsters, MonstersTypes } from '../constants/monsters';
import { Position, SerializedPosition } from '../../position/position';
import { dungeonState } from '../../state/application.state';
import { NaturalWeaponFactory } from '../../items/factory/naturalWeapon.factory';
import { SerializedEntityModel } from '../models/entity.model';
import { entityRegistry } from '../../global/entityRegistry';

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
  ): MonsterEntity {
    if (type in monsterTypeToFactoryMethod) {
      return monsterTypeToFactoryMethod[type](startingPosition, serializedData);
    }

    throw new Error('Invalid monster type');
  }

  public static getGiantRatController(
    startingPosition: SerializedPosition,
    serializedData?: SerializedEntityModel,
  ): MonsterEntity {
    const controller = new MonsterEntity({
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
