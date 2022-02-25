import { EntityController } from '../controllers/entity.controller';
import { EntityControllerCollection } from '../entity.collection';
import { PlayerController } from '../controllers/player.controller';
import { SerializedEntityModel } from '../models/entity.model';
import { MonsterController } from '../controllers/monster.controller';
import { MonsterModel } from '../models/monster.model';

export class EntityFactory {
  public static getEntityControllerollection(
    entities?: EntityController[],
  ): EntityControllerCollection {
    return new EntityControllerCollection(entities || []);
  }

  public static getPlayerController(
    serializedData?: SerializedEntityModel,
  ): PlayerController {
    return PlayerController.getInstance(serializedData);
  }

  public static getMonsterController(
    serializedData?: SerializedEntityModel,
  ): MonsterController {
    const model = new MonsterModel(serializedData);

    return new MonsterController({ model });
  }
}
