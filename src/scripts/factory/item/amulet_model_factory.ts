import {AmuletNames} from '../../constants/weapons';
import {AmuletModel} from '../../model/items/amulet_model';
import {amuletsData} from '../../model/items/data/amulets';

export class AmuletModelFactory {
    public static getAmuletModel(type: AmuletNames): AmuletModel {
        const amuletData = amuletsData[type];

        return new AmuletModel(amuletData);
    }
    public static getRandomAmuletModel(): AmuletModel {
        const amuletsDataKeys = Object.keys(amuletsData);
        const randomKey = amuletsDataKeys.random();

        return AmuletModelFactory.getAmuletModel(randomKey as AmuletNames);
    }
}
