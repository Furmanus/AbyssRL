import {IAnyObject} from './common';
import {EntityModel} from '../model/entity/entity_model';
import {EntityController} from '../controller/entity/entity_controller';
import {PlayerController} from '../controller/entity/player_controller';
import {WalkAttemptResult} from '../model/dungeon/cells/effects/walk_attempt_result';
import {UseAttemptResult} from '../model/dungeon/cells/effects/use_attempt_result';
import {ItemsCollection} from '../collections/items_collection';
import {DungeonTypes} from '../constants/dungeon_types';
import {CellTypes} from '../constants/cell_types';
import {StairDirections} from '../constants/stairs_directions';
import {DungeonTerrainSprites, TerrainSprites} from '../constants/sprites';

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
export interface ICellConstructorConfig {
    dungeonType: DungeonTypes;
    levelNumber: number;
    type?: CellTypes;
    description?: string;
    display?: TerrainSprites[];
}
export interface IStairsCellConstructorConfig extends ICellConstructorConfig {
    direction: StairDirections;
}
export interface IDoorsCellConstructorConfig extends ICellConstructorConfig {
    openDoorsDisplay?: DungeonTerrainSprites;
}
