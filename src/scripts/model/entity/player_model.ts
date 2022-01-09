import { EntityModel, SerializedEntityModel } from './entity_model';
import { IAnyObject } from '../../interfaces/common';
import { MonsterSizes, MonstersTypes } from '../../constants/entity/monsters';
import { getMonsterNaturalWeapon } from '../../factory/natural_weapon_factory';
import { PlayerEquipSlots } from '../../constants/entity/inventory';
import { IPlayerEquipSlotsType } from '../../interfaces/entity/entity_interfaces';

export class PlayerModel extends EntityModel {
  constructor(config: SerializedEntityModel) {
    super(config);

    this.description = config.description || 'Anonymous brave hero';
    this.type = MonstersTypes.Player;
    this.size = MonsterSizes.Medium;
    this.naturalWeapon = getMonsterNaturalWeapon(MonstersTypes.Player);
  }

  public get equipSlots(): IPlayerEquipSlotsType {
    return {
      [PlayerEquipSlots.Body]: this.equippedArmour,
      [PlayerEquipSlots.RightHand]: this.equippedWeapon,
    };
  }
}
