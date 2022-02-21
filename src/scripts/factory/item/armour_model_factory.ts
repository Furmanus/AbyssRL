import { ArmourNames } from '../../constants/items/armour_names';
import {
  ArmourModel,
  SerializedArmour,
} from '../../model/items/armours/armour_model';
import { armourData } from '../../model/items/armours/armour_model_data';

export class ArmourModelFactory {
  public static getArmourModel(data: SerializedArmour): ArmourModel;
  public static getArmourModel(data: ArmourNames): ArmourModel;
  public static getArmourModel(
    data: ArmourNames | SerializedArmour,
  ): ArmourModel {
    if (typeof data === 'string') {
      return new ArmourModel(armourData[data]);
    }

    return new ArmourModel(data);
  }

  public static getRandomArmourModel(): ArmourModel {
    return new ArmourModel(
      armourData[Object.keys(armourData).random() as ArmourNames],
    );
  }
}
