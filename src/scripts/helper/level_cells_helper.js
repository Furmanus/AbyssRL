import {config as globalConfig} from '../global/config';
import {Utility} from "./utility";

export function getRectangleFromLevelCells(levelCells, x, y, width, height){

}
/**
 * For given (x,y) coordinates function returns array of coordinates within radius.
 * @param {number}  x       Horizontal coordinate of circle center.
 * @param {number}  y       Vertical coordinate of circle center.
 * @param {number}  radius  Radius.
 * @returns {Array}
 */
export function getCircleFromLevelCells(x, y, radius){
    const circle = [];
    let examinedX;
    let examinedY;
    let maxWidth = globalConfig.LEVEL_WIDTH - 2;
    let maxHeight = globalConfig.LEVEL_HEIGHT - 2;

    for(let i=-2; i<=2; i++){
        for(let j=-2; j<=2; j++){
            examinedX = x + i;
            examinedY = y + j;
            if(examinedX < 1 || examinedX > maxWidth || examinedY < 1 || examinedY > maxHeight){
                continue;
            }
            if(i === 0 && j === 0){
                continue;
            }
            if(Utility.getDistance(x, y, examinedX, examinedY) <= radius){
                circle.push({
                    x: examinedX,
                    y: examinedY
                });
            }
        }
    }

    return circle;
}