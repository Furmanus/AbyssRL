import { Entity } from '../entity/entities/entity';
import { PlayerEntity } from '../entity/entities/player.entity';
import { MonstersTypes } from '../entity/constants/monsters';

export function isPlayerController(
  entityController: Entity,
): entityController is PlayerEntity {
  return entityController.getModel().type === MonstersTypes.Player;
}
