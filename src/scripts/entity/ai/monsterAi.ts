import { Ai } from './ai';
import { MonsterController } from '../controllers/monster.controller';

export class MonsterAi extends Ai<MonsterController> {
  public performNextMove(): void {
    super.performNextMove();
  }
}
