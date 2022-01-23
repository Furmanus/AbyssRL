import { NaturalWeaponModel } from './natural_weapon_model';
import { Dice } from '../../dice';
import { MonsterAttackTypes } from '../../../constants/entity/monsters';
import { DamageTypes } from '../../../constants/combat_enums';
import { ItemTypes } from '../../../constants/items/item';

const weaponModel: NaturalWeaponModel = new NaturalWeaponModel({
  itemType: ItemTypes.NaturalWeapon,
  damage: '2d5',
  toHit: '1d2',
  naturalType: MonsterAttackTypes.Fist,
  type: DamageTypes.Bludgeoning,
  criticalDamageType: [],
  name: 'test',
  criticalHitRate: 0,
});
const testDice: Dice = new Dice('2d5');
const testDiceSecond: Dice = new Dice('1d2');

const serializedWeaponModel: string =
  '{"damage":"2d5","toHit":"1d2","type":"bludgeoning","naturalType":"fist"}';

describe('Test natural weapon model', () => {
  const testWeaponModel = new NaturalWeaponModel({
    itemType: ItemTypes.NaturalWeapon,
    damage: '2d5',
    toHit: '1d2',
    naturalType: MonsterAttackTypes.Fist,
    type: DamageTypes.Bludgeoning,
    name: 'test',
    criticalHitRate: 0,
    criticalDamageType: [],
  });
  const secondTestWeaponModel = new NaturalWeaponModel({
    itemType: ItemTypes.NaturalWeapon,
    damage: '2d5',
    toHit: '1d2',
    naturalType: MonsterAttackTypes.Fist,
    type: DamageTypes.Bludgeoning,
    criticalDamageType: [],
    criticalHitRate: 0,
    name: 'test',
  });

  it('Should construct weapon model properly', () => {
    expect(testWeaponModel).toEqual(weaponModel);
    expect(secondTestWeaponModel).toEqual(weaponModel);
  });
  it('Should serialize weapon model properly', () => {
    expect(testWeaponModel.getDataToSerialization()).toBe(
      serializedWeaponModel,
    );
  });
  it('Should create proper model instance from serialized string', () => {
    expect(new NaturalWeaponModel(JSON.parse(serializedWeaponModel))).toEqual(
      testWeaponModel,
    );
  });
});
