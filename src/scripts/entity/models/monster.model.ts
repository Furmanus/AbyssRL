import { EntityModel, SerializedEntityModel } from './entity.model';
import { IEntity } from '../entity_interfaces';
import { IAnyObject } from '../../interfaces/common';
import { monstersData, MonsterStats } from '../monsters/data/monsters';
import { MonsterSizes, MonstersTypes } from '../constants/monsters';
import { entities } from '../../dungeon/constants/sprites.constants';
import { ItemsCollection } from '../../items/items_collection';
import { EntityController } from '../controllers/entity.controller';

export class MonsterModel extends EntityModel implements IEntity {
  public isHostile: boolean = true;

  public constructor(config: SerializedEntityModel) {
    super(config);

    const entityConfig: MonsterStats = monstersData[config.type];

    this.description = config.description ?? entityConfig.description;
    this.display = config.display ?? entityConfig.display;
    this.size = config.size ?? entityConfig.size;
    this.lastVisitedCell = config.lastVisitedCell || null;
    this.speed = this.speed || entityConfig.speed;
    this.perception = this.perception || entityConfig.perception;
    this.type = this.type || entityConfig.type;
    this.strength = this.strength || entityConfig.strength;
    this.dexterity = this.dexterity || entityConfig.dexterity;
    this.intelligence = this.intelligence || entityConfig.intelligence;
    this.toughness = this.toughness || entityConfig.toughness;
    this.hitPoints = this.hitPoints || entityConfig.hitPoints;
    this.maxHitPoints = this.maxHitPoints || entityConfig.maxHitPoints;
    this.protection = this.protection || entityConfig.protection;
  }
}
