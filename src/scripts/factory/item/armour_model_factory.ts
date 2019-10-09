import {ArmourModel} from '../../model/items/armour_model';
import {ArmourNames} from '../../constants/weapons';
import {armoursData} from '../../model/items/data/armours';

export class ArmourModelFactory {
    public static getArmourModel(type: ArmourNames): ArmourModel {
        const armourConfigData = armoursData[type];

        return new ArmourModel(armourConfigData);
    }
    public static getRandomArmourModel(): ArmourModel {
        const armourDataKeys = Object.keys(armoursData);
        const randomKey = armourDataKeys.random();

        return new ArmourModel(armoursData[randomKey]);
    }
}
