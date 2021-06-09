import { IAnyObject } from './common';
import { EntityModel } from '../model/entity/entity_model';
import { EntityController } from '../controller/entity/entity_controller';
import { PlayerController } from '../controller/entity/player_controller';
import { WalkAttemptResult } from '../model/dungeon/cells/effects/walk_attempt_result';
import { UseAttemptResult } from '../model/dungeon/cells/effects/use_attempt_result';
import { ItemsCollection } from '../collections/items_collection';

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
