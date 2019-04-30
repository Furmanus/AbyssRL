import {Collection} from './collection';
import {Cell} from '../model/dungeon/cells/cell_model';

export class CellsCollection extends Collection<Cell> {
    public getCell(x: number, y: number): Cell {
        let cell: Cell;

        this.forEach((cellModel: Cell) => {
            if (cellModel.x === x && cellModel.y === y) {
                cell = cellModel;
            }
        });

        return cell;
    }
}
