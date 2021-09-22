import { EntityModel } from './entity_model';
import { IAnyObject } from '../../interfaces/common';
import { MonsterSizes, MonstersTypes } from '../../constants/entity/monsters';
import { getMonsterNaturalWeapon } from '../../factory/natural_weapon_factory';
import { PlayerEquipSlots } from '../../constants/entity/inventory';
import { IPlayerEquipSlotsType } from '../../interfaces/entity/entity_interfaces';

export class PlayerModel extends EntityModel {
  constructor(config: IAnyObject = {}) {
    super(config);

    this.description = config.name || 'Anonymous brave hero';
    this.type = MonstersTypes.Player;
    this.strength = config.strength;
    this.dexterity = config.dexterity;
    this.intelligence = config.intelligence;
    this.toughness = config.toughness;
    this.hitPoints = config.hitPoints;
    this.maxHitPoints = config.maxHitPoints;
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
