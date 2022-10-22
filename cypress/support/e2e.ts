// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './dungeon';
import './player';
import type { PlayerModel } from '../../src/scripts/entity/models/player.model';
import type { WeaponModel } from '../../src/scripts/items/models/weapons/weapon.model';
import type { ArmourModel } from '../../src/scripts/items/models/armours/armour_model';
import type { ItemModel } from '../../src/scripts/items/models/item.model'
import type { DungeonState } from '../../src/scripts/state/dungeon.state';
import type { Cell } from '../../src/scripts/dungeon/models/cells/cell_model';
import type { Coordinates } from '../interfaces/interfaces';

export type LoadPageOptions = {
  seed?: number;
  dungeonDataFileName?: string;
  playerDataFileName?: string;
}

declare global {
    namespace Cypress {
      interface Chainable<Subject> {
          /**
           * Custom command to select DOM element by data-test attribute.
           */
          getApplicationElement(name: string): Chainable<JQuery<Element>>;
          setRNGSeed(value: number): Chainable<void>;
          pressKey(keyChar: string | string[]): Chainable<void>;
          loadPage(opts?: LoadPageOptions): Chainable<JQuery<Element>>;
          /**
          * Custom command used to get player data.
          */
          getPlayerData(): Chainable<PlayerModel>;
          getPlayerInventory(): Chainable<ItemModel[]>;
          getPlayerEquippedWeapon(): Chainable<WeaponModel>;
          getPlayerEquippedArmour(): Chainable<ArmourModel>;
          getPlayerWeaponFromInventory(index: number): Chainable<WeaponModel>;
          getPlayerArmourFromInventory(index: number): Chainable<ArmourModel>;
          getCurrentPlayerCell(): Chainable<Cell>;
          getCurrentPlayerPosition(): Chainable<Coordinates>;
          /**
           * Dungeon
           */
          getDungeonData(): Chainable<DungeonState>;
          getCurrentLevelCell(coords?: Coordinates): Chainable<Cell>;
          getCurrentLevelCellInventory(coords?: Coordinates): Chainable<ItemModel[]>;
      }

      export interface Window {
        _application: {
          playerModel: PlayerModel;
          dungeonState: DungeonState;
        };
      }
    }
  }
