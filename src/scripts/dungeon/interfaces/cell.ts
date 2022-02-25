import { IAnyObject } from '../../interfaces/common';
import { EntityModel } from '../../entity/models/entity.model';
import { EntityController } from '../../entity/controllers/entity.controller';
import { PlayerController } from '../../entity/controllers/player.controller';
import { WalkAttemptResult } from '../models/cells/effects/walk_attempt_result';
import { UseAttemptResult } from '../models/cells/effects/use_attempt_result';
import { ItemsCollection } from '../../items/items_collection';

export interface ICellModel {
  x: number;
  y: number;
  entity: EntityModel;
  inventory: ItemsCollection;
  preventDisplayChange: boolean;
  wasDiscoveredByPlayer: boolean;
  confirmMovement: boolean;
  displaySet: string;
  // implemented as getters and setters
  readonly blockMovement: boolean;
  readonly blocksLos: boolean;
  readonly walkMessage: string;
  readonly modifiers: IAnyObject;
  display: string;
  // methods
  enableDisplayChange: () => void;
  disableDisplayChange: () => void;
  changeDisplay: (tiles: string[]) => void;
  walkEffect: (entity?: EntityController) => void;
  walkAttempt: (entity: PlayerController) => WalkAttemptResult;
  useEffect: (entity: EntityController) => void;
  useAttempt: (entity: PlayerController) => UseAttemptResult;
}
