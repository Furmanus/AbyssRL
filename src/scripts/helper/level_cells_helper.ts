import {config as globalConfig} from '../global/config';
import * as Utility from './utility';
import {Position} from '../model/position/position';

/**
 * For given (x,y) coordinates function returns array of coordinates within radius.
 *
 * @param    x       Horizontal coordinate of circle center.
 * @param    y       Vertical coordinate of circle center.
 * @param    radius  Radius.
 * @returns          Returns array of level cells which are inside circle.
 */
export function getCircleFromLevelCells(x: number, y: number, radius: number): Position[] {
    const circle: Position[] = [];
    const maxWidth: number = globalConfig.LEVEL_WIDTH - 2;
    const maxHeight: number = globalConfig.LEVEL_HEIGHT - 2;
    let examinedX: number;
    let examinedY: number;

    for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
            examinedX = x + i;
            examinedY = y + j;
            if (examinedX < 1 || examinedX > maxWidth || examinedY < 1 || examinedY > maxHeight) {
                continue;
            }
            if (i === 0 && j === 0) {
                continue;
            }
            if (Utility.getDistance(x, y, examinedX, examinedY) <= radius) {
                circle.push(new Position(examinedX, examinedY));
            }
        }
    }
    return circle;
}
