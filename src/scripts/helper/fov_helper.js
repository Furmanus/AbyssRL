import ROT from 'rot-js';
import {config} from '../global/config';
import {Utility} from './utility';
/**
 * Calculates field of view for given entity.
 * @param {EntityModel}     entity      Model of entify
 */
export function calculateFov (entity) {
    const {
        level,
        position
    } = entity;
    const calculatedFov = [];
    /**
     * Function used to determine whether certain cell allows to fov pass through.
     */
    const fov = new ROT.FOV.PreciseShadowcasting((x, y) => {
        const levelWidth = config.LEVEL_WIDTH;
        const levelHeight = config.LEVEL_HEIGHT;

        if (x < 0 || y < 0 || x >= levelWidth || y >= levelHeight) {
            return false;
        }
        if (position.x === x && position.y === y) {
            return true;
        }

        return !level.getCell(x, y).blockLos;
    });

    fov.compute(position.x, position.y, entity.perception, function (x, y) {
        if (Utility.getDistance(position.x, position.y, x, y) < entity.perception) {
            calculatedFov.push(level.getCell(x, y));
            level.getCell(x, y).wasDiscoveredByPlayer = true;
        }
    });

    return calculatedFov;
}