import {IEntity} from '../../../../interfaces/entity_interfaces';
import {Monsters} from '../../../../constants/monsters';
import {entities} from '../../../../constants/sprites';

interface IMonsterDataObject {
  [key: string]: Partial<IEntity>;
}

export const monstersData: IMonsterDataObject =  {
  [Monsters.GIANT_RAT]: {
    strength: 2,
    dexterity: 10,
    intelligence: 5,
    toughness: 2,
    speed: 15,
    perception: 6,
    description: "giant rat",
    type: Monsters.GIANT_RAT,
    display: entities.GIANT_RAT,
  },
};
