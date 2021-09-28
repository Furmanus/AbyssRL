export abstract class DungeonEvent {
  public constructor(private speed: number) {}

  public act(): void {}

  public getSpeed(): number {
    return this.speed;
  }
}
