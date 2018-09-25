export class Position {
    /**
     * Consturctor function of Position class. Instances have x, y properties (coordinates).
     *
     * @param {number}  x   Horizontal position.
     * @param {number}  y   Vertical position.
     */
    constructor(x, y) {
        if ('number' !== typeof x || 'number' !== typeof y) {
            throw new TypeError('Position constructor arguments has to be numbers');
        }

        this.x = x;
        this.y = y;
    }
    /**
     * Method responsible for checking if position instance is adjacent to given coordinates.
     *
     * @param {number}     x   Horizontal coordinate of cell
     * @param {number}     y   Vertical coordinate of examined cell
     */
    checkIfIsAdjacent(x, y) {
        if ('number' === typeof x) {
            return (Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1);
        } else if (x instanceof Position) {
            return (Math.abs(this.x - x.x) <= 1 && Math.abs(this.y - x.y) <= 1);
        }
    }
}