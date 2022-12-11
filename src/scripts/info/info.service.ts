import { InfoView } from './info.view';
import { config } from '../global/config';
import { dungeonTypeToName } from '../dungeon/constants/dungeonTypes.constants';
import { ILevelInfo } from '../dungeon/interfaces/level';
import { IEntityStatsObject } from '../entity/models/entity.model';
import { Cell } from '../dungeon/models/cells/cell_model';
import { EntityStatusesCollection } from '../entity/entity_statuses/entityStatuses.collection';

const constructorToken = Symbol('Info controller');
let instance: InfoService = null;

/**
 * Controller of info data visible to player (player character info like HP, stats...).
 */
export class InfoService {
  private view: InfoView;

  constructor(token: symbol) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }
  }

  public static getInstance(): InfoService {
    if (!instance) {
      instance = new InfoService(constructorToken);
    }

    return instance;
  }

  public initialize(tileset: HTMLImageElement): void {
    if (!this.view) {
      this.view = new InfoView(
        config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
        config.TILE_SIZE * config.COLUMNS,
        tileset,
      );
    }
  }

  /**
   * Method responsible for changing size of info screen.
   * @param   newWidth        New width of info screen.
   * @param   newHeight       New height of info screen.
   */
  public changeInfoScreenSize(newWidth: number, newHeight: number): void {
    this.view.changeSize(newWidth, newHeight);
  }

  /**
   * Changes player name in view.
   *
   * @param name  New text
   */
  public changePlayerNameMessageInView(name: string): void {
    this.view.changePlayerNameMessage(name);
  }

  /**
   * Changes level information in view.
   *
   * @param levelInfo     Data with informations about level
   */
  public changeLevelInfoMessage(levelInfo: ILevelInfo): void {
    this.view.changeLevelInfoMessage(
      `Level ${levelInfo.levelNumber} of ${
        dungeonTypeToName[levelInfo.branch]
      }`,
    );
  }

  /**
   * Displays player stats in view.
   *
   * @param stats Object with player statistics
   */
  public setPlayerStatsInView(
    stats: IEntityStatsObject,
    modifiers: Partial<IEntityStatsObject>,
  ): void {
    this.view.setPlayerStats(stats, modifiers);
  }

  public setEntityStatusesInView(statuses: EntityStatusesCollection): void {
    this.view.setEntityStatuses(statuses);
  }

  /**
   * Displays information about currently examined cell.
   *
   * @param cell  Cell which info is supposed to be displayed
   */
  public displayCellInformation(cell: Cell): void {
    this.view.displayCellDescriptionInView(cell);
  }

  /**
   * Hides examined cell information in view.
   */
  public hideCellInformation(): void {
    this.view.removeDisplayCellDescription();
  }
}

export const globalInfoController = InfoService.getInstance();
