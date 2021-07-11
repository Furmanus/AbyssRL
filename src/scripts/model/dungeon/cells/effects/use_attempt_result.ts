export class UseAttemptResult {
  public canUse: boolean;
  public message: string;
  public endTurn: boolean;
  /**
   * Constructor for object describing attempt of entity to walk over cell.
   *
   * @param   canUse      Variable indicating if attempt was successful
   * @param   message     Message when entity tries to walk on cell
   * @param   endTurn     Variable indicating if attempt should result in used entity (player) turn
   */
  constructor(
    canUse: boolean = true,
    message: string = '',
    endTurn: boolean = false,
  ) {
    this.canUse = canUse;
    this.message = message;
    this.endTurn = endTurn;
  }
}
