export class UseEffectResult {
    constructor(useSuccessful = false, message = '', endTurn = false) {
        this.useSuccessful = useSuccessful;
        this.message = message;
        this.endTurn = endTurn;
    }
}