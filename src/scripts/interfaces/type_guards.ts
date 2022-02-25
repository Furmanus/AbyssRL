import { EntityController } from '../entity/controllers/entity.controller';
import { PlayerController } from '../entity/controllers/player.controller';
import { MonstersTypes } from '../entity/constants/monsters';

export function isPlayerController(
  entityController: EntityController,
): entityController is PlayerController {
  return entityController.getModel().type === MonstersTypes.Player;
}
