import {config} from '../global/config';

export class Camera{

    /**
     * Camera constructor.
     * @param {number} x - Row coordinate of upper left side of camera.
     * @param {number} y - Column coordinate of upper left side of camera.
     * @param {number} screenWidth - Width(measured in squares) of game view.
     * @param {number} screenHeight - Height(measured in squares) of game view.
     */
    constructor(x, y, screenWidth, screenHeight){

        this._x = x;
        this._y = y;
        this._screenWidth = screenWidth;
        this._screenHeight = screenHeight;
    }

    /**
     * Method responsible for moving camera by certain values.
     * @param {number} x - Value to move camera horizontally.
     * @param {number} y - Value to move camera vertically.
     */
    moveCamera(x, y){
        //we check if camera won't go off view
        if(this._x + x >= 0 && this._x + x + this._screenWidth <= config.LEVEL_WIDTH){

            this._x += x;
        }else if(Math.abs(x) > 1){

            //if camera goes off view and x or y is greater than 1, we set camera either to 0 or level width - view width
            if(this._x + x < 0){

                this._x = 0;
            }else if(this._x + x + this._screenWidth > config.LEVEL_WIDTH){

                this._x = config.LEVEL_WIDTH - this._screenWidth;
            }
        }

        if(this._y + y >= 0 && this._y + y + this._screenHeight <= config.LEVEL_HEIGHT){

            this._y += y;
        }else if(Math.abs(y) > 1){

            if(this._y + y < 0){

                this._y = 0;
            }else if(this._y + y + this._screenHeight > config.LEVEL_HEIGHT){

                this._y = config.LEVEL_HEIGHT - this._screenHeight;
            }
        }
    }

    /**
     * Method responsible for returning current camera coordinates of its upper left point.
     * @returns {{x: {number}, y: {number}}} Returns object literal with current camera's upper left point coordinates.
     */
    getCoords(){

        return {x: this._x, y: this._y};
    }

    /**
     * Method responsible for converting view coordinates(row x and column y) converted to current level of x and y.
     * @param {number} x - Row coordinate of point we want to convert.
     * @param {number} y - Column coordinate of point we want to convert.
     * @returns {{x: {number}, y: {number}}} Returns object with converted {@code x} and {@code y} coordinates.
     */
    getConvertedCoordinates(x, y){

        return {x: this._x + x, y: this._y + y};
    }

    /**
     * Method responsible for centering camera on certain coordinates.
     * @param {number} x - row view coordinate
     * @param {number} y - column view coordinate
     */
    centerOnCoordinates(x, y){

        let newCameraX = null; //new camera x coordinate of upper left point.
        let newCameraY = null; //new camera y coordinate of upper left point.

        /**
         * Basic idea behind algorithm: we check three conditions. First we check if object position is close to top or left side of view. If it is, we don't scroll camera further, instead
         * we set camera upper left coords same as upper left coords of view. Next we check if object position is close to bottom or right edge of game map. If it is, we scroll right or
         * bottom side of camera to respectively right or bottom side of map. If none of previous conditions happens, we just centre camera on object position.
         */
        if(x < this._screenWidth / 2){

            newCameraX = 0;
        }else if(x > config.LEVEL_WIDTH - (this._screenWidth / 2)){

            newCameraX = config.LEVEL_WIDTH - this._screenWidth;
        }else{

            newCameraX = x - Math.floor(this._screenWidth / 2);
        }

        if(y < this._screenHeight / 2){

            newCameraY = 0;
        }else if(y > config.LEVEL_HEIGHT - (this._screenHeight / 2)){

            newCameraY = config.LEVEL_HEIGHT - this._screenHeight;
        }else{

            newCameraY = y - Math.floor(this._screenHeight / 2);
        }

        this._x = newCameraX;
        this._y = newCameraY;
    }
}