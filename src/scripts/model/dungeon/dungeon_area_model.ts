import {Rectangle} from '../position/rectangle';
import * as Utility from '../../helper/utility';
import {Position} from '../position/position';
import {uid as generateUid} from '../../helper/uid_helper';

export class DungeonAreaModel extends Rectangle {
    /**
     * Identifier of region. Every value can appear only twice - when two regions were created from splitting one
     * bigger regions, both will have same uid.
     */
    public uid: string;
    /**
     * Is area connected with other area.
     */
    public isConnected: boolean;
    /**
     * Iteration number in which region was created.
     */
    public iteration: number;
    /**
     * Describes on which side region is connected with adjacent region.
     */
    public adjacentRegionDirection: string;

    constructor(leftTopCorner: Position, width: number, height: number, uid: string, iteration: number) {
        super(leftTopCorner, width, height);

        this.uid = uid;
        this.isConnected = false;
        this.iteration = iteration;
        this.adjacentRegionDirection = '';
    }
    get left(): number {
        return this.leftTop.x;
    }
    get top(): number {
        return this.leftTop.y;
    }
    get right(): number {
        return this.rightBottom.x;
    }
    get bottom(): number {
        return this.rightBottom.y;
    }
    /**
     * Splits rectangle vertically into two separate rectangles.
     */
    public splitHorizontal(iteration: number): Rectangle[] {
        const {
            x,
            y,
        } = this.leftTop;
        const splitFromCenterDirection = Math.random() < 0.5 ? -1 : 1;
        const splitPoint = x + Math.floor(this.width / 2) + splitFromCenterDirection * (Utility.getRandomNumberFromRange(
            0,
            Math.floor(this.width / 4),
        ));
        const uid = generateUid();
        const firstRegion = new DungeonAreaModel(new Position(x, y), splitPoint - x, this.height, uid, iteration);
        const secondRegion = new DungeonAreaModel(
            new Position(splitPoint + 1, y),
            (x + this.width - splitPoint - 1),
            this.height,
            uid,
            iteration,
        );

        firstRegion.adjacentRegionDirection = 'right';
        secondRegion.adjacentRegionDirection = 'left';

        return [
            firstRegion,
            secondRegion,
        ];
    }
    /**
     * Splits rectangle horizontally into two separate rectangles.
     */
    public splitVertical(iteration: number): Rectangle[] {
        const {
            x,
            y,
        } = this.leftTop;
        const splitFromCenterDirection = Math.random() < 0.5 ? -1 : 1;
        const splitPoint = y + Math.floor(this.height / 2) + splitFromCenterDirection * (Utility.getRandomNumberFromRange(
            0,
            Math.floor(this.height / 4),
        ));
        const uid = generateUid();
        const firstRegion = new DungeonAreaModel(new Position(x, y), this.width, splitPoint - y, uid, iteration);
        const secondRegion = new DungeonAreaModel(
            new Position(x, splitPoint + 1),
            this.width,
            (y + this.height - splitPoint - 1),
            uid,
            iteration,
        );

        firstRegion.adjacentRegionDirection = 'bottom';
        secondRegion.adjacentRegionDirection = 'top';

        return [
            firstRegion,
            secondRegion,
        ];
    }
}
