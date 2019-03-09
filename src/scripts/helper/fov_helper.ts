import * as ROT from 'rot-js';
import {config} from '../global/config';
import {getDistance} from './utility';
import {EntityModel} from '../model/entity/entity_model';
import {Cell} from '../model/dungeon/cells/cell_model';
/**
 * Calculates field of view for given entity.
 * @param   entity      Model of entity
 */
export function calculateFov(entity: EntityModel): Cell[] {
    const {
        level,
        position,
    } = entity;
    const calculatedFov: Cell[] = [];
    /**
     * Function used to determine whether certain cell allows to fov pass through.
     */
    const fov = new ROT.FOV.PreciseShadowcasting((x, y): boolean => {
        const levelWidth: number = config.LEVEL_WIDTH;
        const levelHeight: number = config.LEVEL_HEIGHT;
        const cell: Cell = level.getCell(x, y);

        if (x < 0 || y < 0 || x >= levelWidth || y >= levelHeight) {
            return false;
        }
        if (position.x === x && position.y === y) {
            return true;
        }

        return !cell.blocksLos;
    });

    fov.compute(position.x, position.y, entity.perception, (x, y): void => {
        const cell: Cell = level.getCell(x, y);

        if (cell && getDistance(position.x, position.y, x, y) < entity.perception) {
            calculatedFov.push(cell);
            cell.wasDiscoveredByPlayer = true;
        }
    });

    return calculatedFov;
}
