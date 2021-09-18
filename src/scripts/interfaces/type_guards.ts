import { EntityController } from '../controller/entity/entity_controller';
import { PlayerController } from '../controller/entity/player_controller';
import { MonstersTypes } from '../constants/entity/monsters';

export function isPlayerController(
  entityController: EntityController,
): entityController is PlayerController {
  return entityController.getModel().type === MonstersTypes.Player;
}
