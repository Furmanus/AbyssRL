import {Rectangle} from '../position/rectangle';
import * as Utility from '../../helper/utility';
import {Position} from '../position/position';
import {config} from '../../global/config';
import * as Rng from '../../helper/rng';
import {BaseModel} from '../../core/base_model';
import {IAnyFunction} from '../../interfaces/common';

type rectOrLeft = IExtendedRectangle | number;
interface IExtendedRectangle extends Rectangle {
    iteration?: number;
}

export class RoomModel extends BaseModel {
    constructor(rectangleOrLeft: rectOrLeft, top?: number, width?: number, height?: number) {
        super();

        if (rectangleOrLeft instanceof Rectangle) {
            this.rectangle = rectangleOrLeft.copy();

            if (rectangleOrLeft.iteration) {
                this.iteration = rectangleOrLeft.iteration;
            }
        } else {
            this.rectangle = new Rectangle(new Position(rectangleOrLeft, top), width, height);
        }

        this.cells = {};
        /**
         * Set of door positions in room.
         */
        this.doorSpots = new Set();
        /**
         * If room contain stairs up.
         */
        this.hasStairsUp = false;

        this.initialize();
    }
    get left(): number {
        return this.rectangle.leftTop.x;
    }
    get top(): number {
        return this.rectangle.leftTop.y;
    }
    get bottom(): number {
        return this.rectangle.leftBottom.y;
    }
    get right(): number {
        return this.rectangle.rightBottom.x;
    }
    get width(): number {
        return this.rectangle.width;
    }
    get height(): number {
        return this.rectangle.height;
    }
    protected initialize(): void {
        const {
            left,
            top,
            right,
            bottom,
        } = this;

        for (let i = left; i <= right; i++) {
            for (let j = top; j <= bottom; j++) {
                if (
                    i === left ||
                    i === right ||
                    j === top ||
                    j === bottom ||
                    i === config.LEVEL_WIDTH - 1 ||
                    j === config.LEVEL_HEIGHT - 1
                ) {
                    this.cells[`${i},${j}`] = 1;
                } else {
                    this.cells[`${i},${j}`] = 0;
                }
            }
        }
    }
    public recalculateCells(): void {
        this.cells = {};
        this.initialize();
    }
    public transform(callback: IAnyFunction): this {
        const {
            cells,
        } = this;

        Object.keys(cells).forEach((item) => {
            const cellPosition = Utility.getPositionFromString(item, ',');

            callback(cellPosition.x, cellPosition.y, cells[item]);
        });

        return this;
    }
    public scale(ratio: number): this {
        this.rectangle.scale(ratio);
        this.recalculateCells();

        return this;
    }
    public addDoorSpot(position: Position): this {
        this.doorSpots.add(position);

        return this;
    }
    public getDistanceFromRoom(room: RoomModel): number {
        const rect = this.rectangle;
        const thisLeftTop = rect.leftTop;
        const thisLeftBottom = rect.rightBottom;
        const thisRightTop = rect.rightTop;
        const thisRightBottom = rect.rightBottom;
        const examinedRect = room.rectangle;
        const examinedLeftTop = examinedRect.leftTop;
        const examinedLeftBottom = examinedRect.leftBottom;
        const examinedRightTop = examinedRect.rightTop;
        const examinedRightBottom = examinedRect.rightBottom;
        const thisHorizontalBefore = Math.sign(room.left - this.right) < 0;
        const thisVerticalBefore = Math.sign(room.top - this.bottom) < 0;
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
    public getRandomRoomCellPosition(): Position {
        return new Position(
            Rng.getRandomNumber(this.left + 1, this.right - 1),
            Rng.getRandomNumber(this.top + 1, this.bottom - 1),
        );
    }
}
