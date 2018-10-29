import {Position} from './position';
import {Utility} from '../../helper/utility';

export class Rectangle {
    /**
     *
     * @param {Position}    leftTopCorner       Position of top left corner
     * @param {number}      width               Width of rectangle
     * @param {number}      height              Height of rectangle
     */
    constructor(leftTopCorner, width, height) {
        this.leftTop = leftTopCorner;
        this.width = width;
        this.height = height;
    }
    /**
     * @returns {number}
     */
    get left() {
        return this.leftTop.x;
    }
    /**
     * @returns {number}
     */
    get top() {
        return this.leftTop.y;
    }
    /**
     * @returns {number}
     */
    get right() {
        return this.rightBottom.x;
    }
    /**
     * @returns {number}
     */
    get bottom() {
        return this.rightBottom.y;
    }
    /**
     * @returns {Position}
     */
    get rightTop() {
        return new Position(this.leftTop.x + this.width, this.leftTop.y);
    }
    /**
     * @returns {Position}
     */
    get leftBottom() {
        return new Position(this.leftTop.x, this.leftTop.y + this.height);
    }
    /**
     * @returns {Position}
     */
    get rightBottom() {
        return new Position(this.leftTop.x + this.width, this.leftTop.y + this.height);
    }
    /**
     * @returns {number}
     */
    get area() {
        return this.width * this.height;
    }
    /**
     * Scales rectangle by given ratio.
     *
     * @param {number}   ratio
     */
    scale(ratio) {
        this.width = Math.floor(this.width * ratio);
        this.height = Math.floor(this.height * ratio);
    }
    /**
     * Moves rectangle by given vector.
     *
     * @param {Vector}  vector
     */
    move(vector) {
        this.leftTop = new Position(this.leftTop.x + vector.x, this.leftTop.y + vector.y);
    }
    /**
     * Makes a copy of rectangle.
     *
     * @returns {Rectangle}
     */
    copy() {
        return new Rectangle(this.leftTop, this.width, this.height);
    }
    /**
     *
     * @param {Rectangle}   rect
     * @returns {number}
     */
    getHorizontalDistanceFromRect(rect) {
        const firstRect = rect.left < this.left ? rect : this,
            secondRect = firstRect === this ? rect : this;

        return Math.max(secondRect.left - firstRect.right, 0);
    }
    /**
     *
     * @param {Rectangle}   rect
     * @returns {number}
     */
    getVerticalDistanceFromRect(rect) {
        const firstRect = rect.top < this.top ? rect : this,
            secondRect = firstRect === this ? rect : this;

        return Math.max(secondRect.top - firstRect.bottom, 0);
    }
}