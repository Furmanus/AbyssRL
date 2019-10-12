import {EntityActualStats} from '../../constants/monsters';
import {BaseModel} from '../../core/base_model';

type StatsModifers = {
    [P in EntityActualStats]?: number;
};

export interface IModifiersModel {
    stats?: StatsModifers;
}

export class ModifiersModel extends BaseModel {
    public stats: StatsModifers;

    public constructor(config: IModifiersModel) {
        super();

        this.stats = config.stats;
    }
    public getSerializedData(): object {
        return {
            ...super.getSerializedData(),
            stats: {...this.stats},
        };
    }
}
