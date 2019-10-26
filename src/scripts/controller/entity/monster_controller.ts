import {EntityController} from './entity_controller';
import {MonsterModel} from '../../model/entity/monster_model';
import {MonsterAi} from '../../strategy/ai/monster_ai';
import {MonstersTypes} from '../../constants/monsters';
import {AnimalAi} from '../../strategy/ai/animal_ai';
import {HumanoidAi} from '../../strategy/ai/humanoid_ai';

interface IMonsterControllerConfig {
    model: MonsterModel;
}
type monstersAi = typeof MonsterAi | typeof AnimalAi;
function getEntityAiStrategy(type: MonstersTypes): monstersAi {
    switch (type) {
        case MonstersTypes.GIANT_RAT:
            return AnimalAi;
        case MonstersTypes.ORC:
            return HumanoidAi;
        default:
            return MonsterAi;
    }
}

export class MonsterController extends EntityController<MonsterModel> {
    private ai: MonsterAi;

    public constructor(config: IMonsterControllerConfig) {
        super(config);

        this.model = config.model;
        this.ai = new (getEntityAiStrategy(this.model.type))({
            controller: this,
        });

        this.attachEvents();
    }
    protected attachEvents(): void {
        super.attachEvents();
    }

    public act(): void {
        this.calculateFov();
        this.ai.performNextMove();
    }
}
