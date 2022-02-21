import { EntityModel, SerializedEntityModel } from './entity_model';
import { IAnyObject } from '../../interfaces/common';
import { MonsterSizes, MonstersTypes } from '../../constants/entity/monsters';
import { PlayerEquipSlots } from '../../constants/entity/inventory';
import { IPlayerEquipSlotsType } from '../../interfaces/entity/entity_interfaces';
import { NaturalWeaponFactory } from '../../factory/natural_weapon_factory';
import { ItemsCollection } from '../../collections/items_collection';
import { WeaponModelFactory } from '../../factory/item/weapon_model_factory';
import { ArmourModelFactory } from '../../factory/item/armour_model_factory';

export class PlayerModel extends EntityModel {
  public inventory = new ItemsCollection([
    WeaponModelFactory.getRandomWeaponModel(),
    WeaponModelFactory.getRandomWeaponModel(),
    WeaponModelFactory.getRandomWeaponModel(),
    ArmourModelFactory.getRandomArmourModel(),
    ArmourModelFactory.getRandomArmourModel(),
    ArmourModelFactory.getRandomArmourModel(),
  ]); // TODO temporary, for testing

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
