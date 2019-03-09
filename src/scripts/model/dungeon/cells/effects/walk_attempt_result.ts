export class WalkAttemptResult {
    public canMove: boolean;
    public message: string;
    /**
     * Constructor for object describing attempt of entity to walk over cell.
     *
     * @param   canMove     Variable indicating if attempt was successful
     * @param   message     Message when entity tries to walk on cell
     */
    constructor(canMove: boolean = true, message: string = '') {
        this.canMove = canMove;
        this.message = message;
    }
}
