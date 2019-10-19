import {AmuletNames} from '../../../constants/weapons';
import {ModifiersModel} from '../modifiers_model';
import {EntityActualStats} from '../../../constants/monsters';
import {ModifiersFactory} from '../../../factory/item/modifiers_factory';

interface IAmuletConfig {
    name: AmuletNames;
    modifiers?: ModifiersModel;
}
type RingsDataType = {
    [P in AmuletNames]: IAmuletConfig;
};

export const amuletsData: RingsDataType = {
    [AmuletNames.NECKLACE]: {
        name: AmuletNames.NECKLACE,
    },
    [AmuletNames.AMULET_OF_PROTECTION]: {
        name: AmuletNames.AMULET_OF_PROTECTION,
        modifiers: ModifiersFactory.getStatsModifiers({
            stats: {
                [EntityActualStats.PROTECTION]: 2,
            },
        }),
    },
    [AmuletNames.SPIKED_COLLAR]: {
        name: AmuletNames.SPIKED_COLLAR,
        modifiers: ModifiersFactory.getStatsModifiers({
            stats: {
                [EntityActualStats.PROTECTION]: 1,
            },
        }),
    },
};
