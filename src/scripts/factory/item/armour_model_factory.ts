import { ArmourNames } from '../../constants/items/armour_names';
import { ArmourModel } from '../../model/items/armours/armour_model';
import { armourData } from '../../model/items/armours/armour_model_data';

export class ArmourModelFactory {
  public static getArmourModel(name: ArmourNames): ArmourModel {
    return new ArmourModel(armourData[name]);
  }

  public static getRandomArmourModel(): ArmourModel {
    return new ArmourModel(
      armourData[Object.keys(armourData).random() as ArmourNames],
    );
  }
}
