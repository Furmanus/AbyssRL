import { EntityModel, SerializedEntityModel } from './entity.model';
import { IAnyObject } from '../../interfaces/common';
import { MonsterSizes, MonstersTypes } from '../constants/monsters';
import { PlayerEquipSlots } from '../constants/inventory';
import { IPlayerEquipSlotsType } from '../entity_interfaces';
import { NaturalWeaponFactory } from '../../items/factory/naturalWeapon.factory';
import { ItemsCollection } from '../../items/items_collection';
import { WeaponModelFactory } from '../../items/factory/item/weaponModel.factory';
import { ArmourModelFactory } from '../../items/factory/item/armour_model_factory';

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
