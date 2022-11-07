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
import type { Coordinates, PressKeyOptions } from '../interfaces/interfaces';
import { EntityModel } from '../../src/scripts/entity/models/entity.model';
import { DungeonBranches } from '../../src/scripts/dungeon/constants/dungeonTypes.constants';

export type LoadPageOptions = {
  seed?: number;
  dungeonDataFileName?: string;
  playerDataFileName?: string;
}

interface CurrentLevelData {
  levelNumber: number;
  branch: DungeonBranches;
}

declare global {
    namespace Cypress {
      interface Chainable<Subject> {
          /**
           * Custom command to select DOM element by data-test attribute.
           */
          getApplicationElement(name: string): Chainable<JQuery<Element>>;
          setRNGSeed(value: number): Chainable<Subject>;
          pressKey(keyChar: string | string[], options?: PressKeyOptions): Chainable<Subject>;
          pressShift(): Chainable<Subject>;
          releaseShift(): Chainable<Subject>;
          loadPage(opts?: LoadPageOptions): Chainable<JQuery<Element>>;
          /**
          * Custom command used to get player data.
          */
          getPlayerData(): Chainable<PlayerModel>;
          getPlayerHitPoints(): Chainable<number>;
          getPlayerInventory(): Chainable<ItemModel[]>;
          getPlayerEquippedWeapon(): Chainable<WeaponModel>;
          getPlayerEquippedArmour(): Chainable<ArmourModel>;
          getPlayerWeaponFromInventory(index: number): Chainable<WeaponModel>;
          getPlayerArmourFromInventory(index: number): Chainable<ArmourModel>;
          getCurrentPlayerCell(): Chainable<Cell>;
          getCurrentPlayerPosition(): Chainable<Coordinates>;
          getFirstEntityInPlayerFov(): Chainable<EntityModel>;
          /**
           * Dungeon
           */
          getDungeonData(): Chainable<DungeonState>;
          getCurrentLevelCell(coords?: Coordinates): Chainable<Cell>;
          getCurrentLevelCellInventory(coords?: Coordinates): Chainable<ItemModel[]>;
          getCurrentLevelCellContainerInventory(coords?: Coordinates): Chainable<ItemModel[]>;
          getCurrentLevelData(): Chainable<CurrentLevelData>;
          assertIfCellIsVisibleByPlayer(x: number, y: number): Chainable<Subject>
          assertIfCellIsNotVisibleByPlayer(x: number, y: number): Chainable<Subject>;
      }

      export interface Window {
        _application: {
          playerModel: PlayerModel;
          dungeonState: DungeonState;
        };
      }
    }
  }
