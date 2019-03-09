export class UseEffectResult {
    public useSuccessful: boolean;
    public message: string;
    public endTurn: boolean;

    constructor(useSuccessful: boolean = false, message: string = '', endTurn: boolean = false) {
        this.useSuccessful = useSuccessful;
        this.message = message;
        this.endTurn = endTurn;
    }
}
