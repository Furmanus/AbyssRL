import {Rectangle} from '../position/rectangle';
import * as Utility from '../../helper/utility';
import {Position} from '../position/position';
import {uid as generateUid} from '../../helper/uid_helper';

export class DungeonAreaModel extends Rectangle {
    constructor(leftTopCorner, width, height, uid, iteration) {
        super(leftTopCorner, width, height);

        /**
         * Identifier of region. Every value can appear only twice - when two regions were created from splitting one
         * bigger regions, both will have same uid.
         * @type {string}
         */
        this.uid = uid;
        /**
         * Is area connected with other area.
         * @type {boolean}
         */
        this.isConnected = false;
        /**
         * Iteration number in which region was created.
         * @type {number}
         */
        this.iteration = iteration;
        /**
         * Describes on which side region is connected with adjacent region.
         * @type {string}
         */
        this.adjacentRegionDirection = '';
    }
    get left() {
        return this.leftTop.x;
    }
    get top() {
        return this.leftTop.y;
    }
    get right() {
        return this.rightBottom.x;
    }
    get bottom() {
        return this.rightBottom.y;
    }
    /**
     * Splits rectangle vertically into two separate rectangles.
     *
     * @returns {Array.<Rectangle>}
     */
    splitHorizontal(iteration) {
        const {
                x,
                y
            } = this.leftTop,
            splitFromCenterDirection = Math.random() < 0.5 ? -1 : 1,
            splitPoint = x + Math.floor(this.width / 2) + splitFromCenterDirection * (Utility.getRandomNumberFromRange(
                0,
                Math.floor(this.width / 4)
            )),
            uid = generateUid(),
            firstRegion = new DungeonAreaModel(new Position(x, y), splitPoint - x, this.height, uid, iteration),
            secondRegion = new DungeonAreaModel(new Position(splitPoint + 1, y), (x + this.width - splitPoint - 1), this.height, uid, iteration);

        firstRegion.adjacentRegionDirection = 'right';
        secondRegion.adjacentRegionDirection = 'left';

        return [
            firstRegion,
            secondRegion
        ];
    }
    /**
     * Splits rectangle horizontally into two separate rectangles.
     *
     * @returns {Array.<Rectangle>}
     */
    splitVertical(iteration) {
        const {
                x,
                y
            } = this.leftTop,
            splitFromCenterDirection = Math.random() < 0.5 ? -1 : 1,
            splitPoint = y + Math.floor(this.height / 2) + splitFromCenterDirection * (Utility.getRandomNumberFromRange(
                0,
                Math.floor(this.height / 4)
            )),
            uid = generateUid(),
            firstRegion = new DungeonAreaModel(new Position(x, y), this.width, splitPoint - y, uid, iteration),
            secondRegion = new DungeonAreaModel(new Position(x, splitPoint + 1), this.width, (y + this.height - splitPoint - 1), uid, iteration);

        firstRegion.adjacentRegionDirection = 'bottom';
        secondRegion.adjacentRegionDirection = 'top';

        return [
            firstRegion,
            secondRegion
        ];
    }
}