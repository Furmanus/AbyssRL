import { LevelModel } from '../model/dungeon/level_model';
import { Cell } from '../model/dungeon/cells/cell_model';
import { MonsterController } from '../controller/entity/monster_controller';
import { MonsterModel } from '../model/entity/monster_model';
import { Monsters, MonstersTypes } from '../constants/entity/monsters';
import { LevelController } from '../controller/dungeon/level_controller';

export class MonsterFactory {
  public static getMonsterControllerByType(
    type: Monsters,
    levelController: LevelController,
    startingPosition: Cell,
  ): MonsterController {
    if (type in monsterTypeToFactoryMethod) {
      return monsterTypeToFactoryMethod[type](
        levelController,
        startingPosition,
      );
    }

    throw new Error('Invalid monster type');
  }

  public static getGiantRatController(
    levelController: LevelController,
    startingPosition: Cell,
  ): MonsterController {
    return new MonsterController({
      model: new MonsterModel({
        type: MonstersTypes.GiantRat,
        position: startingPosition,
        level: levelController.model,
      }),
      levelController,
    });
  }
}

const monsterTypeToFactoryMethod = {
  [Monsters.GiantRat]: MonsterFactory.getGiantRatController,
};
