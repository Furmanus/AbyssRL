import { IAnyObject } from '../../interfaces/common';
import { Entity } from '../../entity/entities/entity';
import { PlayerEntity } from '../../entity/entities/player.entity';
import { WalkAttemptResult } from '../models/cells/effects/walk_attempt_result';
import { UseAttemptResult } from '../models/cells/effects/use_attempt_result';
import { ItemsCollection } from '../../items/items_collection';

export interface ICellModel {
  x: number;
  y: number;
  entity: Entity;
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
  walkEffect: (entity?: Entity) => void;
  walkAttempt: (entity: PlayerEntity) => WalkAttemptResult;
  useEffect: (entity: Entity) => void;
  useAttempt: (entity: PlayerEntity) => UseAttemptResult;
}
