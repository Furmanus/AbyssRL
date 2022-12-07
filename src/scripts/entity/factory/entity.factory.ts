import { Entity } from '../entities/entity';
import { EntityCollection } from '../entity.collection';
import { PlayerEntity } from '../entities/player.entity';
import { SerializedEntityModel } from '../models/entity.model';
import { MonsterEntity } from '../entities/monster.entity';
import { MonsterModel } from '../models/monster.model';

export class EntityFactory {
  public static getEntityCollection(
    entities?: Entity[],
  ): EntityCollection {
    return new EntityCollection(entities || []);
  }

  public static getPlayerEntity(
    serializedData?: SerializedEntityModel,
  ): PlayerEntity {
    return PlayerEntity.getInstance(serializedData);
  }

  public static getMonsterEntity(
    serializedData?: SerializedEntityModel,
  ): MonsterEntity {
    const model = new MonsterModel(serializedData);

    return new MonsterEntity({ model });
  }
}
