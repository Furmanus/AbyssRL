import { EntityController } from '../../controller/entity/entity_controller';
import { EntityControllerCollection } from '../../collections/entity_collection';
import { PlayerController } from '../../controller/entity/player_controller';
import { SerializedEntityModel } from '../../model/entity/entity_model';
import { MonsterController } from '../../controller/entity/monster_controller';
import { MonsterModel } from '../../model/entity/monster_model';

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
