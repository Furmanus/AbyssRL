import {BaseModel} from '../../../core/base_model';
import {INaturalWeapon} from '../../../interfaces/combat';
import {Dice} from '../../dice';
import {DamageTypes} from '../../../constants/combat_enums';
import {MonsterAttackTypes} from '../../../constants/monsters';

export class NaturalWeaponModel extends BaseModel implements INaturalWeapon {
    public damage: Dice;
    public toHit: Dice;
    public type: DamageTypes;
    public naturalType: MonsterAttackTypes;

    public constructor(config: Partial<INaturalWeapon>) {
        const {
            damage,
            toHit,
        } = config;

        super();

        if (typeof damage === 'string') {
            this.damage = new Dice(damage);
        } else {
            this.damage = damage;
        }
        if (typeof toHit === 'string') {
            this.toHit = new Dice(toHit);
        } else {
            this.toHit = toHit;
        }
        this.type = config.type;
        this.naturalType = config.naturalType;
    }
    public getDataToSerialization(): string {
        return JSON.stringify({
            damage: this.damage.getSerializedData(),
            toHit: this.toHit.getSerializedData(),
            type: this.type,
            naturalType: this.naturalType,
        });
    }
}
