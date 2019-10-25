import {RingsNames} from '../../../constants/weapons';
import {ModifiersModel} from '../modifiers_model';
import {EntityActualStats} from '../../../constants/monsters';
import {ModifiersFactory} from '../../../factory/item/modifiers_factory';

interface IRingConfig {
    name: RingsNames;
    modifiers?: ModifiersModel;
}
type RingsDataType = {
    [P in RingsNames]: IRingConfig;
};

export const ringsData: RingsDataType = {
    [RingsNames.RING]: {
        name: RingsNames.RING,
    },
    [RingsNames.RING_OF_PROTECTION]: {
        name: RingsNames.RING_OF_PROTECTION,
        modifiers: ModifiersFactory.getStatsModifiers({
            stats: {
                [EntityActualStats.PROTECTION]: 2,
            },
        }),
    },
};
