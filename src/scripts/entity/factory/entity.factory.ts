import { Entity } from '../controllers/entity';
import { EntityControllerCollection } from '../entity.collection';
import { PlayerEntity } from '../controllers/player.entity';
import { SerializedEntityModel } from '../models/entity.model';
import { MonsterEntity } from '../controllers/monster.entity';
import { MonsterModel } from '../models/monster.model';

export class EntityFactory {
  public static getEntityControllerollection(
    entities?: Entity[],
  ): EntityControllerCollection {
    return new EntityControllerCollection(entities || []);
  }

  public static getPlayerController(
    serializedData?: SerializedEntityModel,
  ): PlayerEntity {
    return PlayerEntity.getInstance(serializedData);
  }

  public static getMonsterController(
    serializedData?: SerializedEntityModel,
  ): MonsterEntity {
    const model = new MonsterModel(serializedData);

    return new MonsterEntity({ model });
  }
}
