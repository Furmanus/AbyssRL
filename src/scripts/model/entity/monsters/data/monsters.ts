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
        strength: 2,
        dexterity: 10,
        intelligence: 5,
        toughness: 2,
        speed: 15,
        perception: 6,
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
};
