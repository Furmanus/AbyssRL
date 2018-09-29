export class WalkAttemptResult {
    /**
     * Constructor for object describing attempt of entity to walk over cell.
     *
     * @param {boolean}     canMove     Variable indicating if attempt was successful
     * @param {string}      message     Message when entity tries to walk on cell
     */
    constructor(canMove = true, message = '') {
        this.canMove = canMove;
        this.message = message;
    }
}