import { InfoView } from '../view/info_view';
import { config } from '../global/config';
import { Controller } from './controller';
import { dungeonTypeToName } from '../constants/dungeon_types';
import { ILevelInfo } from '../interfaces/level';
import { IEntityStatsObject } from '../model/entity/entity_model';
import { Cell } from '../model/dungeon/cells/cell_model';

/**
 * Controller of info data visible to player (player character info like HP, stats...).
 */
export class InfoController extends Controller {
  private view: InfoView;

  constructor(tileset: HTMLImageElement) {
    super();

    this.view = new InfoView(
      config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
      config.TILE_SIZE * config.COLUMNS,
      tileset,
    );
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
  public setPlayerStatsInView(stats: IEntityStatsObject): void {
    this.view.setPlayerStats(stats);
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
