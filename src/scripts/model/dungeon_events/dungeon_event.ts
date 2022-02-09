import { BaseModel } from '../../core/base_model';

export abstract class DungeonEvent extends BaseModel {
  public constructor(private speed: number) {
    super();
  }

  public act(): void {}

  public getSpeed(): number {
    return this.speed;
  }
}
