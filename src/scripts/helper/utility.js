/**
 * Abstract class of utility functions.
 * @abstract
 */
import {config} from '../global/config';

export class Utility{

    /**
     * Calculates and returns distance between two points.
     * @param {number} x1 - horizontal(row) coordinate of first point
     * @param {number} y1 - vertical(column) coordinate of first point
     * @param {number} x2 - horizontal(row) coordinate of second point
     * @param {number} y2 - vertical(column) coordinate of second point
     * @return {number} Returns calculated distance between two points.
     */
    static getDistance(x1, y1, x2, y2){

        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Method which executes provided callback function on every point of bresenham line between points (x1, y1) and (x2, y2).
     * @param {number} x1 - Horizontal(row) coordinate of starting point.
     * @param {number} y1 - Vertical(column) coordinate of starting point.
     * @param {number} x2 - Horizontal(row) coordinate of target point.
     * @param {number} y2 - Vertical(column) coordinate of target point.
     * @param {function} callback - Callback function to execute on every point of bresenham line.
     */
    static bresenhamLine(x1, y1, x2, y2, callback){

        let deltaX = Math.abs(x2 - x1);
        let deltaY = Math.abs(y2 - y1);

        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;

        let err = deltaX - deltaY;

        while(true){

            let e2 = 2*err;

            if(!(x1 < 1 || y1 < 1 || x1 >= config.LEVEL_WIDTH - 1 || y1 >= config.LEVEL_HEIGHT - 1)){

                callback(x1, y1);
            }

            if(x1 === x2 && y1 === y2){

                break;
            }

            if(e2 > -deltaY){

                err -= deltaY;
                x1 += sx;
            }

            if(e2 < deltaX){

                err += deltaX;
                y1 += sy;
            }
        }
    }

    /**
     * Method responsible for sorting array containing similiar objects(with same keys, or at least key used as sort-key mu appear in every object) by certain key. Elements with lowest
     * value for chosen key will be placed at beginning of array.
     * @param {Object[]} arr - Array we want to sort.
     * @param {string} key - Objects key by which array is going to be sorted.
     */
    static sortArray(arr, key){

        let n = arr.length;
        let tmpElement = null; //temporary variable, used to store referrence to object while swapping them

        do{

            for(let i=0; i<n-1; i++){

                if(arr[i][key] > arr[i+1][key]){

                    tmpElement = arr[i];
                    arr[i] = arr[i+1];
                    arr[i+1] = tmpElement;
                }
            }

            n--;
        }while(n>1)
    }

    /**
     * Flood fill algorithm which triggers provided callback function for every (x, y) cell on map. Border object can be passed as argument, border is an array which stores objects
     * {x: {@code number}, y: {@code number}} of map cells which stops propagation of algorithm.
     * @param {Object[]} border - (Optional)Array which stores objects in form {x: {@code number}, y: {@code number}} of map cells which stops propagation of algorithm.
     * @param {number} x - Row coordinate of cell where algorithm starts.
     * @param {number} y - Column coordinate of cell where algorithm starts.
     * @param {function} callback - Callback function called for every (x, y) coordinates on path of algorithm.
     */
    static floodFill(border, x, y, callback){

        let visitedCells = {}; //Object {x y: true} storing information by already visited cells by algorithm as keys x + " " + y.

        flood(x, y);

        function flood(x, y){

            //if algorithm goes off level map, we stop current function
            if(x < 1 || y < 1 || x > config.LEVEL_WIDTH - 1 || y > config.LEVEL_HEIGHT - 1){
                return;
            }

            //if examined cell was already visited, we stop current function
            if(visitedCells[x + ' ' + y]){
                return;
            }

            //if border was passed as algorithm and examined cell is a border, we stop current function
            if(border && meetsBorder(x, y)){
                return;
            }

            visitedCells[x + ' ' + y] = true; //we mark currently examined cell as visited
            callback(x, y); //trigger provided callback function for currently examined cell

            //recursively call flood function for all surrounding coordinates
            flood(x - 1, y - 1);
            flood(x - 1, y);
            flood(x - 1, y + 1);
            flood(x, y - 1);
            flood(x, y + 1);
            flood(x + 1, y - 1);
            flood(x + 1, y);
            flood(x + 1, y + 1);
        }

        //check if currently examined cell is a border (is in border array provided as main function argument)
        function meetsBorder(x, y){

            for(let i=0; i<border.length; i++){
                if(border[i].x === x && border[i].y === y){

                    return true;
                }
            }

            return false;
        }
    }

    /**
     * Checks whether certain coordinates in form of object {x: x, y: y} are present in certain {@code array} passed as parameter.
     * @param {Object[]} array - array in which we want to find given coordinates.
     * @param {number} x - row coordinate
     * @param {number} y - column coordinate
     * @return {boolean} - Returns true if coordinates were found in given array, returns false otherwise.
     */
    static findCoords(array, x, y){

        for(let i=0; i<array.length; i++){
            if(array[i].x === x && array[i].y === y){

                return true;
            }
        }

        return false;
    }
    /**
     * Converts two given points in form {x: x, y: y} to direction in form {x: x, y: y} between them. For example for points {x: 1, y: 1} and {x: 2, y: 1} direction will be
     * {x: 1, y: 0}. This is just a direction, not a vector with length, so direction between points {x: 1, y: 1} and {x: 10, y: 1} still will be {x: 1, y: 0}.
     * @param {Object} coords1 - Starting point
     * @param {Object} coords2 - Goal point
     * @return {{x: number, y: number}} - Returns direction object {x: number, y: number} where x and y can be equal only to -1, 0, 1.
     */
    static convertCoordsToDirection(coords1, coords2){

        let directionX = coords2.x - coords1.x;
        let directionY = coords2.y - coords1.y;

        if(directionX !== 0){

            directionX = directionX > 0 ? 1 : -1;
        }

        if(directionY !== 0){

            directionY = directionY > 0 ? 1 : -1;
        }

        return {x: directionX, y: directionY};
    }
    /**
     * Capitalizes first letter of given text.
     * @param {string}  text    Text with first letter to capitalize.
     * @returns {string}        Returns transformed text.
     */
    static capitalizeString(text){

        return text.charAt(0).toUpperCase() + text.slice(1);
    }
}