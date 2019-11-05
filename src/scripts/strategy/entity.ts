import {MonstersTypes} from '../constants/monsters';
import {ItemsCollection} from '../collections/items_collection';
import {weaponModelFactory} from '../factory/item/weapon_model_factory';
import {ArmourModelFactory} from '../factory/item/armour_model_factory';
import {RingModelFactory} from '../factory/item/ring_model_factory';
import {AmuletModelFactory} from '../factory/item/amulet_model_factory';

export class EntityStrategy {
    public static getMonsterEquipment(type: MonstersTypes): ItemsCollection {
        switch (type) {
            case MonstersTypes.ORC:
                return new ItemsCollection();
            case MonstersTypes.PLAYER:
                return new ItemsCollection([
                    weaponModelFactory.getRandomWeaponModel(),
                    ArmourModelFactory.getRandomArmourModel(),
                    RingModelFactory.getRandomRingModel(),
                    AmuletModelFactory.getRandomAmuletModel(),
                ]);
            default:
                return new ItemsCollection();
        }
    }
}
