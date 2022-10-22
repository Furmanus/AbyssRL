import { EntityModel, SerializedEntityModel } from './entity.model';
import { MonsterSizes, MonstersTypes } from '../constants/monsters';
import { PlayerEquipSlots } from '../constants/inventory';
import { IPlayerEquipSlotsType } from '../entity_interfaces';
import { NaturalWeaponFactory } from '../../items/factory/naturalWeapon.factory';
import { ItemsCollection } from '../../items/items_collection';

export class PlayerModel extends EntityModel {
  public inventory = new ItemsCollection([]);

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
