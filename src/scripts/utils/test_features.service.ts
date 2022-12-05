import type { PlayerEntity } from '../entity/controllers/player.entity';
import { applicationConfigService } from '../global/config';
import { ArmourNames } from '../items/constants/armourNames.constants';
import { WeaponNames } from '../items/constants/weapons.constants';
import { ArmourModelFactory } from '../items/factory/item/armour_model_factory';
import { WeaponModelFactory } from '../items/factory/item/weaponModel.factory';
import { ItemModel } from '../items/models/item.model';

const constructorToken = Symbol('TestFeaturesService');

let instance: TestFeaturesService;

interface TestFeaturesServiceConstructorOptions {}

export interface InitPlayerData {
    inventory?: string[];
}

export class TestFeaturesService {
#testPlayerData: InitPlayerData;

public constructor(token: symbol, options: TestFeaturesServiceConstructorOptions) {
  if (token !== constructorToken) {
    throw new Error('Invalid constructor');
  }
}

public static getInstance(options?: TestFeaturesServiceConstructorOptions): TestFeaturesService {
  if (!instance) {
    instance = new TestFeaturesService(constructorToken, options);
  }

  return instance;
}

public async fetchPlayerStartingData(): Promise<void> {
  if (applicationConfigService.testPlayerData) {
    this.#testPlayerData = await fetch(`/public/playerData/${applicationConfigService.testPlayerData}`).then((res) => res.json());
  }
}

public initPlayerData(playerController: PlayerEntity): void {
  if (this.#testPlayerData) {
    const { inventory } = this.#testPlayerData;
    const items: ItemModel[] = [];

    inventory.forEach((item: string) => {
      if (Object.values(ArmourNames).includes(item as ArmourNames)) {
        items.push(ArmourModelFactory.getArmourModel(item as ArmourNames));
      } else if (Object.values(WeaponNames).includes(item as WeaponNames)) {
        items.push(WeaponModelFactory.getWeaponModel(item as WeaponNames));
      }
    });

    playerController.addItemToInventory(items);
  }
}
}
