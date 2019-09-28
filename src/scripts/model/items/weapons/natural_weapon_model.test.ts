import {NaturalWeaponModel} from './natural_weapon_model';
import {Dice} from '../../dice';
import {MonsterAttackTypes} from '../../../constants/monsters';
import {DamageTypes} from '../../../constants/combat_enums';

const weaponModel: NaturalWeaponModel = new NaturalWeaponModel({
    damage: new Dice('2d5'),
    toHit: new Dice('1d2'),
    naturalType: MonsterAttackTypes.FIST,
    type: DamageTypes.BLUDGEONING,
    id: '666',
});
const testDice: Dice = new Dice('2d5');
const testDiceSecond: Dice = new Dice('1d2');

const serializedWeaponModel = {
    damage: "2d5",
    toHit: "1d2",
    type: "bludgeoning",
    naturalType: "fist",
    id: '666',
};

describe('Test natural weapon model', () => {
    const testWeaponModel = new NaturalWeaponModel({
        damage: testDice,
        toHit: testDiceSecond,
        naturalType: MonsterAttackTypes.FIST,
        type: DamageTypes.BLUDGEONING,
        id: '666',
    });
    const secondTestWeaponModel: NaturalWeaponModel = new NaturalWeaponModel({
        damage: '2d5',
        toHit: '1d2',
        naturalType: MonsterAttackTypes.FIST,
        type: DamageTypes.BLUDGEONING,
        id: '666',
    });

    it('Should construct weapon model properly', () => {
        expect(testWeaponModel).toEqual(weaponModel);
        expect(secondTestWeaponModel).toEqual(weaponModel);
    });
    it('Should serialize weapon model properly', () => {
        expect(testWeaponModel.getSerializedData()).toEqual(serializedWeaponModel);
    });
    it('Should properly create model from serialized data', () => {
        expect(new NaturalWeaponModel(serializedWeaponModel)).toEqual(testWeaponModel);
    });
});
