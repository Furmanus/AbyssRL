import { Ai } from './ai';
import { MonsterEntity } from '../entities/monster.entity';

export class MonsterAi extends Ai<MonsterEntity> {
  public performNextMove(): void {
    super.performNextMove();
  }
}
