import {DungeonCollection} from '../collections/dungeon_collection';
import {LevelCollection} from '../collections/level_collection';
import {ItemModel} from '../model/items/item_model';
import {Collection} from '../collections/collection';
import {Cell} from '../model/dungeon/cells/cell_model';

export const globalDungeonsCollection: DungeonCollection = new DungeonCollection();
export const globalLevelCollection: LevelCollection = new LevelCollection();
export const globalItemCollection: Collection<ItemModel> = new Collection<ItemModel>();
export const globalCellsCollection: Collection<Cell> = new Collection<Cell>();
