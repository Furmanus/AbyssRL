import { EntityModel } from './entity_model';
import { IEntity } from '../../interfaces/entity/entity_interfaces';
import { IAnyObject } from '../../interfaces/common';
import { monstersData, MonsterStats } from './monsters/data/monsters';
import { MonsterSizes, MonstersTypes } from '../../constants/entity/monsters';
import { entities } from '../../constants/cells/sprites';
import { ItemsCollection } from '../../collections/items_collection';
import { getMonsterNaturalWeapon } from '../../factory/natural_weapon_factory';

export class MonsterModel extends EntityModel implements IEntity {
  public isHostile: boolean = true;

  public constructor(config: IAnyObject) {
    super(config);

    const entityConfig: MonsterStats = monstersData[config.type];

    this.strength = entityConfig.strength;
    this.dexterity = entityConfig.dexterity;
    this.intelligence = entityConfig.intelligence;
    this.toughness = entityConfig.toughness;
    this.speed = entityConfig.speed;
    this.perception = entityConfig.perception;
    this.description = entityConfig.description;
    this.type = entityConfig.type;
    this.display = entityConfig.display;
    this.protection = entityConfig.protection;
    this.hitPoints = entityConfig.hitPoints;
    this.maxHitPoints = entityConfig.maxHitPoints;
    this.size = entityConfig.size;
    this.inventory = entityConfig.inventory;
    this.naturalWeapon = entityConfig.naturalWeapon;
  }
}
