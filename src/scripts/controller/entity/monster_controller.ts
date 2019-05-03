import {EntityController} from './entity_controller';
import {MonsterModel} from '../../model/entity/monster_model';
import {MonsterAi} from '../../strategy/ai/monster_ai';

interface IMonsterControllerConfig {
    model: MonsterModel;
}

export class MonsterController extends EntityController<MonsterModel> {
    private ai: MonsterAi;

    public constructor(config: IMonsterControllerConfig) {
        super(config);

        this.model = config.model;
        this.ai = new MonsterAi({
            controller: this,
        });
    }
    public act(): void {
        this.calculateFov();
        this.ai.performNextMove();
    }
}
