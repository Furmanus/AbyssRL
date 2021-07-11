import { Ai } from './ai';
import { MonsterController } from '../../controller/entity/monster_controller';

export class MonsterAi extends Ai<MonsterController> {
  public performNextMove(): void {
    super.performNextMove();
  }
}
