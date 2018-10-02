export class UseAttemptResult {
    /**
     * Constructor for object describing attempt of entity to walk over cell.
     *
     * @param {boolean}     canUse      Variable indicating if attempt was successful
     * @param {string}      message     Message when entity tries to walk on cell
     * @param {boolean}     endTurn     Variable indicating if attempt should result in used entity (player) turn
     */
    constructor(canUse = true, message = '', endTurn = false) {
        this.canUse = canUse;
        this.message = message;
        this.endTurn = endTurn;
    }
}