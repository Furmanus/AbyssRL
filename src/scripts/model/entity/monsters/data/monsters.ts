import {IEntity} from '../../../../interfaces/entity_interfaces';
import {MonsterSizes, MonstersTypes} from '../../../../constants/monsters';
import {entities} from '../../../../constants/sprites';
import {ItemsCollection} from '../../../../collections/items_collection';
import {getMonsterNaturalWeapon} from '../../../../factory/natural_weapon_factory';

interface IMonsterDataObject {
    [key: string]: Partial<IEntity>;
}

export const monstersData: IMonsterDataObject =  {
    [MonstersTypes.GIANT_RAT]: {
        baseStrength: 2,
        baseDexterity: 10,
        baseIntelligence: 5,
        baseToughness: 2,
        baseSpeed: 15,
        basePerception: 6,
        description: "giant rat",
        type: MonstersTypes.GIANT_RAT,
        display: entities.GIANT_RAT,
        protection: 0,
        hitPoints: 10,
        maxHitPoints: 10,
        size: MonsterSizes.SMALL,
        inventory: new ItemsCollection(),
        naturalWeapon: getMonsterNaturalWeapon(MonstersTypes.GIANT_RAT),
    },
    [MonstersTypes.ORC]: {
        baseStrength: 10,
        baseDexterity: 6,
        baseIntelligence: 4,
        baseToughness: 12,
        baseSpeed: 10,
        basePerception: 4,
        type: MonstersTypes.ORC,
        description: "orc",
        display: entities.ORC,
        protection: 0,
        hitPoints: 18,
        maxHitPoints: 18,
        size: MonsterSizes.MEDIUM,
        inventory: new ItemsCollection(),
        naturalWeapon: getMonsterNaturalWeapon(MonstersTypes.ORC),
    },
};
