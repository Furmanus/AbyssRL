import { Entity } from '../entity/controllers/entity';
import { PlayerEntity } from '../entity/controllers/player.entity';
import { MonstersTypes } from '../entity/constants/monsters';

export function isPlayerController(
  entityController: Entity,
): entityController is PlayerEntity {
  return entityController.getModel().type === MonstersTypes.Player;
}
