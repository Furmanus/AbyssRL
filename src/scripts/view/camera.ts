import {config} from '../global/config';
import {Position} from '../model/position/position';

export class Camera {
    private x: number;
    private y: number;
    private screenWidth: number;
    private screenHeight: number;
    /**
     * Camera constructor.
     * @param    x               Row coordinate of upper left side of camera.
     * @param    y               Column coordinate of upper left side of camera.
     * @param    screenWidth     Width(measured in squares) of game view.
     * @param    screenHeight    Height(measured in squares) of game view.
     */
    constructor(x: number, y: number, screenWidth: number, screenHeight: number) {
        this.x = x;
        this.y = y;
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }
    /**
     * Method responsible for moving camera by certain values.
     * @param   deltaX      Value to move camera horizontally.
     * @param   deltaY      Value to move camera vertically.
     */
    public moveCamera(deltaX: number, deltaY: number): void {
        // TODO change arguments to one argument with Vector type
        // we check if camera won't go off view
        if (this.x + deltaX >= 0 && this.x + deltaX + this.screenWidth <= config.LEVEL_WIDTH) {
            this.x += deltaX;
        } else if (Math.abs(deltaX) > 1) {
            /**
             * If camera goes off view and x or y is greater than 1, we set camera either to 0 or
             * level width - view width
             */
            if (this.x + deltaX < 0) {

                this.x = 0;
            }else if (this.x + deltaX + this.screenWidth > config.LEVEL_WIDTH) {

                this.x = config.LEVEL_WIDTH - this.screenWidth;
            }
        }

        if (this.y + deltaY >= 0 && this.y + deltaY + this.screenHeight <= config.LEVEL_HEIGHT) {
            this.y += deltaY;
        } else if (Math.abs(deltaY) > 1) {
            if (this.y + deltaY < 0) {
                this.y = 0;
            } else if (this.y + deltaY + this.screenHeight > config.LEVEL_HEIGHT) {
                this.y = config.LEVEL_HEIGHT - this.screenHeight;
            }
        }
    }
    /**
     * Method responsible for returning current camera coordinates of its upper left point.
     */
    public getCoords(): Position {
        return new Position(this.x, this.y);
    }
    /**
     * Method responsible for converting view coordinates(row x and column y) converted to current level of x and y.
     * @param   x - Row coordinate of point we want to convert.
     * @param   y - Column coordinate of point we want to convert.
     * @returns {Position}} Returns object with converted x and y coordinates.
     */
    public getConvertedCoordinates(x: number, y: number): Position {
        // TODO change argument to one argument with Position type
        return new Position(this.x + x, this.x + y);
    }
    /**
     * Method responsible for centering camera on certain coordinates.
     * @param   x   Row view coordinate
     * @param   y   Column view coordinate
     */
    public centerOnCoordinates(x: number, y: number): void {
        let newCameraX = null; // new camera x coordinate of upper left point.
        let newCameraY = null; // new camera y coordinate of upper left point.
        /**
         * Basic idea behind algorithm: we check three conditions. First we check if object position is close to top or
         * left side of view. If it is, we don't scroll camera further, instead we set camera upper left coords same as
         * upper left coords of view. Next we check if object position is close to bottom or right edge of game map. If
         * it is, we scroll right or bottom side of camera to respectively right or bottom side of map. If none of
         * previous conditions happens, we just center camera on object position.
         */
        if (x < this.screenWidth / 2) {
            newCameraX = 0;
        } else if (x > config.LEVEL_WIDTH - (this.screenWidth / 2)) {
            newCameraX = config.LEVEL_WIDTH - this.screenWidth;
        } else {
            newCameraX = x - Math.floor(this.screenWidth / 2);
        }

        if (y < this.screenHeight / 2) {
            newCameraY = 0;
        } else if (y > config.LEVEL_HEIGHT - (this.screenHeight / 2)) {
            newCameraY = config.LEVEL_HEIGHT - this.screenHeight;
        } else {
            newCameraY = y - Math.floor(this.screenHeight / 2);
        }

        this.x = newCameraX;
        this.y = newCameraY;
    }
}
