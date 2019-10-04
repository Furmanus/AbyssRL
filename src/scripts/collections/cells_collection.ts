import {Collection} from './collection';
import {Cell} from '../model/dungeon/cells/cell_model';
import {DungeonTypes} from '../constants/dungeon_types';

export class CellsCollection extends Collection<Cell> {
    /**
     * Returns cell model from specific dungeon branch, dungeon level and at specific coordinates
     * @param dungeonBranch     Name of dungeon branch. Member of DungeonType enum
     * @param levelNumber       Number of level in branch
     * @param x                 Horizontal coordinate of searched cell
     * @param y                 Vertical coordinate of searched cell
     */
    public getCell(dungeonBranch: DungeonTypes, levelNumber: number, x: number, y: number): Cell {
        return this.get().find((cell: Cell) =>
            cell.dungeonBranch === dungeonBranch &&
            cell.levelNumber === levelNumber &&
            cell.x === x &&
            cell.y === y,
        );
    }
}
