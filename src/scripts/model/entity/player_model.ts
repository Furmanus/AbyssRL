import { EntityModel, SerializedEntityModel } from './entity_model';
import { IAnyObject } from '../../interfaces/common';
import { MonsterSizes, MonstersTypes } from '../../constants/entity/monsters';
import { PlayerEquipSlots } from '../../constants/entity/inventory';
import { IPlayerEquipSlotsType } from '../../interfaces/entity/entity_interfaces';
import { NaturalWeaponFactory } from '../../factory/natural_weapon_factory';

export class PlayerModel extends EntityModel {
  constructor(config: SerializedEntityModel) {
    super(config);

    this.description = config.description || 'Anonymous brave hero';
    this.type = MonstersTypes.Player;
    this.size = MonsterSizes.Medium;
    this.naturalWeapon = NaturalWeaponFactory.getMonsterNaturalWeapon(
      MonstersTypes.Player,
    );
  }

  public get equipSlots(): IPlayerEquipSlotsType {
    return {
      [PlayerEquipSlots.Body]: this.equippedArmour,
      [PlayerEquipSlots.RightHand]: this.equippedWeapon,
    };
  }
}
