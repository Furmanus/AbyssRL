import {Observer} from '../../core/observer';
import {Rectangle} from '../position/rectangle';
import {Utility} from '../../helper/utility';
import {Position} from '../position/position';
import {config} from '../../global/config';
import {Rng} from '../../helper/rng';

export class RoomModel extends Observer {
    constructor(rectangleOrLeft, top, width, height) {
        super();

        if (rectangleOrLeft instanceof Rectangle) {
            this.rectangle = rectangleOrLeft.copy();

            if (rectangleOrLeft.iteration) {
                this.iteration = rectangleOrLeft.iteration;
            }
        } else if ('number' === typeof rectangleOrLeft) {
            this.rectangle = new Rectangle(new Position(rectangleOrLeft, top), width, height);
        } else {
            throw new Error('Invalid RoomModel constructor parameter.')
        }

        this.cells = {};
        /**
         * Set of door positions in room.
         * @type {Set<Position>}
         */
        this.doorSpots = new Set();
        /**
         * If room contain stairs up.
         * @type {boolean}
         */
        this.hasStairsUp = false;

        this.initialize();
    }
    get left() {
        return this.rectangle.leftTop.x;
    }
    get top() {
        return this.rectangle.leftTop.y;
    }
    get bottom() {
        return this.rectangle.leftBottom.y;
    }
    get right() {
        return this.rectangle.rightBottom.x;
    }
    get width() {
        return this.rectangle.width;
    }
    get height() {
        return this.rectangle.height;
    }
    initialize() {
        const {
            left,
            top,
            right,
            bottom
        } = this;

        for (let i = left; i<= right; i++) {
            for (let j = top; j<= bottom; j++) {
                if (i === left || i === right || j === top || j === bottom || i === config.LEVEL_WIDTH - 1 || j === config.LEVEL_HEIGHT - 1) {
                    this.cells[`${i},${j}`] = 1;
                } else {
                    this.cells[`${i},${j}`] = 0;
                }
            }
        }
    }
    recalculateCells() {
        this.cells = {};
        this.initialize();
    }
    transform(callback) {
        const {
            cells
        } = this;

        Object.keys(cells).forEach(item => {
            const cellPosition = Utility.getPositionFromString(item, ',');

            callback(cellPosition.x, cellPosition.y, cells[item]);
        });

        return this;
    }
    scale(ratio) {
        this.rectangle.scale(ratio);
        this.recalculateCells();

        return this;
    }
    addDoorSpot(position) {
        this.doorSpots.add(position);
    }
    getDistanceFromRoom(room) {
        const rect = this.rectangle,
            thisLeftTop = rect.leftTop,
            thisLeftBottom = rect.rightBottom,
            thisRightTop = rect.rightTop,
            thisRightBottom = rect.rightBottom,
            examinedRect = room.rectangle,
            examinedLeftTop = examinedRect.leftTop,
            examinedLeftBottom = examinedRect.leftBottom,
            examinedRightTop = examinedRect.rightTop,
            examinedRightBottom = examinedRect.rightBottom,
            thisHorizontalBefore = Math.sign(room.left - this.right) < 0,
            thisVerticalBefore = Math.sign(room.top - this.bottom) < 0;
        let distance;

        if (thisHorizontalBefore && thisVerticalBefore) {
            distance = Utility.getDistanceBetweenPoints(thisRightBottom, examinedLeftTop);
        } else if (thisHorizontalBefore && !thisVerticalBefore) {
            distance = Utility.getDistanceBetweenPoints(thisRightTop, examinedLeftBottom);
        } else if (!thisHorizontalBefore && thisVerticalBefore) {
            distance = Utility.getDistanceBetweenPoints(thisLeftBottom, examinedRightTop);
        } else if (!thisHorizontalBefore && !thisVerticalBefore) {
            distance = Utility.getDistanceBetweenPoints(thisLeftTop, examinedRightBottom);
        }

        return distance;
    }
    getRandomRoomCellPosition() {
        return new Position(
            Rng.getRandomNumber(this.left + 1, this.right - 1),
            Rng.getRandomNumber(this.top + 1, this.bottom - 1)
        );
    }
}