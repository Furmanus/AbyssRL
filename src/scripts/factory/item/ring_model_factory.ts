import {RingsNames} from '../../constants/weapons';
import {RingModel} from '../../model/items/ring_model';
import {ringsData} from '../../model/items/data/rings';

export class RingModelFactory {
    public static getRingModel(type: RingsNames): RingModel {
        const ringData = ringsData[type];

        return new RingModel(ringData);
    }
    public static getRandomRingModel(): RingModel {
        const ringsDataKeys = Object.keys(ringsData);
        const randomKey = ringsDataKeys.random();

        return RingModelFactory.getRingModel(randomKey as RingsNames);
    }
}
