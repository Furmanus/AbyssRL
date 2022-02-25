import { tileset } from '../global/tiledata';
import { CameraView } from './camera.view';
import { Observer } from '../core/observer';
import { CAMERA_MOVED, CANVAS_CELL_CLICK } from '../constants/game_actions';
import { config } from '../global/config';
import { ICoordinates, IStringDictionary } from '../interfaces/common';
import { Cell } from '../dungeon/models/cells/cell_model';
import { LevelModel } from '../dungeon/models/level_model';
import { boundMethod } from 'autobind-decorator';
import { MonstersTypes } from '../entity/constants/monsters';
import { MiscTiles } from '../dungeon/constants/sprites.constants';
import { CanvasFonts } from '../constants/canvas_enum';
import Timeout = NodeJS.Timeout;
import { Vector } from '../position/vector';
import { getPositionFromString } from '../utils/utility';
import { TileDecorator } from './game_view_decorators/tile_decorator';
import { EntityStatuses } from '../entity/constants/statuses';
import { EntityStatusCommonController } from '../entity/entity_statuses/entityStatusCommon.controller';
import { EntityModel } from '../entity/models/entity.model';

interface IMousePosition {
  x: number;
  y: number;
  intervalId: number;
  isCursorBeyondLevel: boolean;
}
interface ISprites {
  [prop: string]: number;
}

interface ITemporayImagesMember {
  sprite: string;
  source?: EntityModel;
}

interface ITemporaryImages {
  [imageTileCoord: string]: ITemporayImagesMember;
}

interface IDrawnTiles {
  [prop: string]: Cell;
}
const ALTERNATIVE_BORDER_LENGTH: number = 8;
const ALTERNATIVE_TILE_SPRITE_TIMEOUT: number = 125;

export class GameView extends Observer {
  private rows: number;
  private columns: number;
  private readonly TILE_SIZE: number;
  private readonly tileset: CanvasImageSource;
  private examineMode: boolean;
  /**
   * Current (in current turn) player field of vision. Used to recognize in draw animated image method if current cell
   * is visible and if entity or inventory should be drawn if image is darkened (cell is not visible);
   */
  private currentPlayerFov: Cell[] = null;
  /**
   * Global animation frame for all animated sprites. Changes every 250ms.
   */
  private globalAnimationFrame: number = 0;
  private currentMousePosition: IMousePosition;
  /**
   * Position of alternative border drawn in examine mode.
   */
  private alternativeBorderPosition: ICoordinates;
  /**
   * Id returned from setInterval method used to animate border in examine mode.
   */
  private alternativeBorderIntervalId: number;
  /**
   * Id returned from setInterval method used to change global animation frame.
   */
  private globalAnimationFrameIntervalId: number;
  private isAlternativeBorderDrawn: boolean;
  private screen: HTMLCanvasElement = document.getElementById(
    'game',
  ) as HTMLCanvasElement;

  private screenContainer: HTMLDivElement = document.getElementById(
    'game-container',
  ) as HTMLDivElement;

  private context: CanvasRenderingContext2D = this.screen.getContext('2d');
  /*
   * Object literal which contains currently drawn animated sprites on view. Data is stored as JSON where keys are
   * map coordinates where object is stored (for example '3x5'). Values are intervals returned by drawAnimatedImage
   */
  private sprites: ISprites = {};
  /*
   * Object which contains all currently drawn not animated sprites on view. Keys are equal to map coordinates
   * (for example '3x5'). Values are equal to names tile information from tiledata.js module
   */
  private drawnTiles: IDrawnTiles = {};
  /**
   * Object with currently drawn, not animated sprites which are not currently visible by player, but were
   * discovered previously
   */
  private foggedTiles: IDrawnTiles = {};
  /*
   * Object literal containing string values used for setting canvas globalCompositeOperation.
   */
  private globalCompositeOperation: IStringDictionary = {
    LIGHTER: 'lighter',
    DARKEN: 'darken',
    LIGHTEN: 'lighten',
  };

  public camera: CameraView;
  private temporaryDrawnImages: ITemporaryImages = {};
  private temporaryShownMessages: Map<Timeout, HTMLSpanElement> = new Map<
    Timeout,
    HTMLSpanElement
  >();

  #tileDecorator: TileDecorator;

  /**
   *
   * @param width     Width of view(in pixels).
   * @param height    Height of view(in pixels).
   * @param tileSize  Size of single tile image(in pixels). We assume tiles are always square.
   * @param tileSet   <Img> Html tag with source pointing at image with tileset.
   */
  constructor(
    width: number,
    height: number,
    tileSize: number = 32,
    tileSet: CanvasImageSource,
  ) {
    super();

    this.TILE_SIZE = tileSize;
    this.rows = width / this.TILE_SIZE;
    this.columns = height / this.TILE_SIZE;
    this.tileset = tileSet;
    this.camera = new CameraView(0, 0, this.rows, this.columns);
    this.#tileDecorator = new TileDecorator(this.context, this.camera);
    /*
        Object holding coordinates of current mouse position on canvas. Used to draw rectangle in mouseMoveEventListener
         */
    this.currentMousePosition = {
      x: null, // row where currently mouse cursor is
      y: null, // column where currently mouse cursor is
      /**
       * unique id from setInterval method where function responsible for drawing and clearing rectangle border
       * around certain tile
       */
      intervalId: null,
      /**
       * boolean variable determining whether mouse cursor is beyond level cells coordinates but still inside canvas
       */
      isCursorBeyondLevel: true,
    };
    this.context.canvas.width = width;
    this.context.canvas.height = height;

    this.initialize();
  }

  protected initialize(): void {
    this.attachEvents();
    this.attachEventsToCamera();

    this.globalAnimationFrameIntervalId = window.setInterval(() => {
      if (this.globalAnimationFrame < 4) {
        this.globalAnimationFrame++;
      } else {
        this.globalAnimationFrame = 0;
      }
    }, 250);
  }

  protected attachEvents(): void {
    this.screen.addEventListener(
      'click',
      this.mouseClickEventListener.bind(this),
    );
    this.screen.addEventListener(
      'mousemove',
      this.mouseMoveEventListener.bind(this),
    );
    this.screen.addEventListener(
      'mouseleave',
      this.mouseLeaveEventListener.bind(this),
    );
  }

  private attachEventsToCamera(): void {
    this.camera.on(this, CAMERA_MOVED, this.onCameraMove);
  }

  /**
   * Method triggered after camera notifies that it has been moved. Moves all temporary image coords by vector by
   * which camera was moved. It's necessary, because otherwise temporary images would have been drawn at wrong places
   * (at least in case of entity which has moved in last turn being hit - coordinates of explosion tiles are calculated
   * first, but they are quickly outdated, because in next turn camera might have been moved).
   *
   * @param vector    Vector
   */
  @boundMethod
  private onCameraMove(vector: Vector): void {
    this.moveTemporaryImagesCoords(vector);
  }

  /**
   * Draws 32x32 pixels tile on game view at certain coordinates. Tile is chosen from game tileset from i row and j column.
   * @param   x               Row position where tile on game view will be drawn
   * @param   y               Column position where tile on game view will be drawn
   * @param   i               Row position from tileset where from tile will be chosen to draw
   * @param   j               Column position from tileset where from tile will be chosen to draw
   * @param   barPercentage   Percentage of horizontal bar drawn at top of image. Drawn only if barPercentage argument
   *                          is passed to this function
   * @param   barColor        Color of horizontal bar above image
   * @param   statuses        Entity different statuses to show as icons on its avatar
   */
  private drawImage(
    x: number,
    y: number,
    i: number,
    j: number,
    barPercentage?: number,
    barColor?: string,
    statuses?: string[],
  ): void {
    const tempSprite: ITemporayImagesMember =
      this.temporaryDrawnImages[`${x}x${y}`];
    let tempSpriteData: { x: number; y: number; frames: number };

    if (tempSprite) {
      tempSpriteData = tileset[tempSprite.sprite];
    }

    this.context.drawImage(
      this.tileset,
      (tempSpriteData ? tempSpriteData.x : i) * this.TILE_SIZE,
      (tempSpriteData ? tempSpriteData.y : j) * this.TILE_SIZE,
      32,
      32,
      x * this.TILE_SIZE,
      y * this.TILE_SIZE,
      32,
      32,
    );

    if (barPercentage && barColor) {
      const barLength: number = Math.floor(this.TILE_SIZE * barPercentage);

      this.context.fillStyle = barColor;
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE - 3,
        barLength,
        4,
      );
    }

    if (statuses && Array.isArray(statuses) && statuses.length) {
      // TODO draw status icon on avatar
    }
  }

  /**
   * Draws 32x32 pixels tile on game view at given coordinates. Tile is chosen from game tileset from x row
   * and y column. Tile is not animated and is darkened. If tile has more than one frame (is animated normally), only
   * first frame is drawn.
   *
   * @param   x        Row position where tile on game view will be drawn
   * @param   y        Column position where tile on game view will be drawn
   * @param   tile     String parameter equal to String key object in tiledata.js file which contains information
   *                   about drawn sprite.
   */
  private drawDarkenedImage(x: number, y: number, tile: string): void {
    const i = tileset[tile].x;
    const j = tileset[tile].y;

    this.drawImage(x, y, i, j);
    this.changeCellBackground(
      x,
      y,
      50,
      50,
      50,
      this.globalCompositeOperation.DARKEN,
    );
  }

  /**
   * Draws 32x32 pixels animated sprite. Spritesheet is selected from GameView tileset field.
   * Spritesheet starts at x row and y column of tileset and contains next framesNumber 32x32 images.
   *
   * @param   x        This parameter is equal to row on canvas where animated sprite is going to be drawn.
   * @param   y        This parameter is equal to column on canvas where animated sprite is going to be drawn.
   * @param   cell     Single map cell which display is being drawn.
   * @param   light    Optional: parameter indicating whether cell will be lightened or darkened. Accepts only
   *                           two values: "LIGHTEN" or "DARKEN".
   * @returns          Returns object containing interval returned by {@code setInterval} method which is
   *                   responsible for animating sprite and current animation frame.
   */
  private drawAnimatedImage(
    x: number,
    y: number,
    cell: Cell,
    light?: string,
  ): number {
    if (!cell) {
      return;
    }
    const isCellNotVisible: boolean = !!this.foggedTiles[`${x}x${y}`];
    const entityStatuses: string[] = [];
    let tile: string;
    let interval;
    let hpBarPercent: number = null;
    let hpBarColor: string = null;

    if (this.currentPlayerFov && this.currentPlayerFov.includes(cell)) {
      if (cell.entity) {
        tile = cell.entity.display;
        hpBarPercent = cell.entity.hitPoints / cell.entity.maxHitPoints;
        hpBarPercent = hpBarPercent > 0 ? hpBarPercent : 0;

        if (cell.entity.type === MonstersTypes.Player) {
          hpBarColor = 'green';
        } else {
          hpBarColor = 'red';
        }

        cell.entity.entityStatuses.forEach(
          (status: EntityStatusCommonController) => {
            // TODO fill statuses array with icon to draw
          },
        );
      } else if (cell.inventory.size) {
        tile = cell.inventory.get(0).display;
      } else {
        tile = cell.displayWhenVisible || cell.display;
      }
    } else {
      tile = cell.display;
    }

    const i = tileset[tile].x;
    const j = tileset[tile].y;
    const framesNumber = tileset[tile].frames; // number of animation frames of selected tile
    light = isCellNotVisible ? 'DARKEN' : light;
    // if there is only one frame to animate, it is simply drawn
    if (framesNumber === 1) {
      this.drawImage(x, y, i, j); // if image isn't animated, we just draw it and end function

      if (light && this.globalCompositeOperation[light]) {
        /**
         * If optional parameter "light" was passed, cell background color is changed
         */
        this.changeCellBackground(
          x,
          y,
          50,
          50,
          50,
          this.globalCompositeOperation[light],
        );
      }

      return null;
    } else {
      this.drawImage(
        x,
        y,
        i + (this.globalAnimationFrame % framesNumber),
        j,
        hpBarPercent,
        hpBarColor,
        entityStatuses,
      ); // we draw frame of animation

      interval = window.setInterval(() => {
        this.drawImage(
          x,
          y,
          i + (this.globalAnimationFrame % framesNumber),
          j,
          hpBarPercent,
          hpBarColor,
          entityStatuses,
        );

        if (light) {
          /**
           * If optional parameter "light" was passed, cell background color is changed
           */
          this.changeCellBackground(
            x,
            y,
            50,
            50,
            50,
            this.globalCompositeOperation[light],
          );
        }
      }, 250);
      /**
       * We store interval in this.sprites object, so we can later stop it in clearGameWindow function
       */
      this.sprites[`${x}x${y}`] = interval;

      return interval;
    }
  }

  /**
   * Clears game window canvas. First all animations are stopped (intervals returned by drawAnimatedImage function)
   * and then whole canvas context is cleared.
   */
  private clearGameWindow(): void {
    // we stop all animations currently being displayed on view
    for (const key of Object.keys(this.sprites)) {
      window.clearInterval(this.sprites[key]);
    }
    // we reset this.sprites and this.tiles objects
    this.sprites = {};
    this.drawnTiles = {};
    this.foggedTiles = {};

    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height,
    );
  }

  /**
   * Function responsible for changing size of canvas where game display is drawn. Along with canvas dimensions, game
   * view object properties rows and columns are also changed.
   *
   * @param   newWidth    New canvas width.
   * @param   newHeight   New canvas height.
   * @param   level       LevelModel model object to redraw.
   * @param   playerFov   Player field of view which is going to be drawn
   */
  public changeGameScreenSize(
    newWidth: number,
    newHeight: number,
    level: LevelModel,
    playerFov: Cell[],
  ): void {
    newWidth = newWidth - (newWidth % this.TILE_SIZE);
    newHeight = newHeight - (newHeight % this.TILE_SIZE);

    this.context.canvas.width = newWidth;
    this.context.canvas.height = newHeight;

    this.rows = newWidth / this.TILE_SIZE;
    this.columns = newHeight / this.TILE_SIZE;

    this.refreshScreen(level, playerFov);
  }

  /**
   * Sets a border around certain tile.
   * @param   x                   Row coordinate of tile
   * @param   y                   Column coordinate of tile
   * @param   color               Colour of border
   * @param   alternativeBorder   If alternative border (border only in corners of cell) should be drawn
   */
  private setBorder(
    x: number,
    y: number,
    color: string,
    alternativeBorder?: boolean,
  ): void {
    this.context.fillStyle = color;
    /*
     * Unusual method to draw border of rectangle in canvas. We draw every part of border as separate filled
     * rectangle, so we can later clear it in separate method.
     */
    if (alternativeBorder) {
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE,
        ALTERNATIVE_BORDER_LENGTH,
        2,
      );
      this.context.fillRect(
        x * this.TILE_SIZE + this.TILE_SIZE - ALTERNATIVE_BORDER_LENGTH,
        y * this.TILE_SIZE,
        ALTERNATIVE_BORDER_LENGTH,
        2,
      );
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE,
        2,
        ALTERNATIVE_BORDER_LENGTH,
      );
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE + this.TILE_SIZE - ALTERNATIVE_BORDER_LENGTH,
        2,
        ALTERNATIVE_BORDER_LENGTH,
      );
      this.context.fillRect(
        x * this.TILE_SIZE + this.TILE_SIZE - 2,
        y * this.TILE_SIZE,
        2,
        ALTERNATIVE_BORDER_LENGTH,
      );
      this.context.fillRect(
        x * this.TILE_SIZE + this.TILE_SIZE - 2,
        y * this.TILE_SIZE + this.TILE_SIZE - ALTERNATIVE_BORDER_LENGTH,
        2,
        ALTERNATIVE_BORDER_LENGTH,
      );
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE + this.TILE_SIZE - 2,
        ALTERNATIVE_BORDER_LENGTH,
        2,
      );
      this.context.fillRect(
        x * this.TILE_SIZE + this.TILE_SIZE - ALTERNATIVE_BORDER_LENGTH,
        y * this.TILE_SIZE + this.TILE_SIZE - 2,
        ALTERNATIVE_BORDER_LENGTH,
        2,
      );
    } else {
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE,
        this.TILE_SIZE,
        2,
      );
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE,
        2,
        this.TILE_SIZE,
      );
      this.context.fillRect(
        x * this.TILE_SIZE + this.TILE_SIZE - 2,
        y * this.TILE_SIZE,
        2,
        this.TILE_SIZE,
      );
      this.context.fillRect(
        x * this.TILE_SIZE,
        y * this.TILE_SIZE + this.TILE_SIZE - 2,
        this.TILE_SIZE,
        2,
      );
    }
  }

  /**
   * Method responsible for removing border from certain tile.
   * @param   x  Row coordinate of tile.
   * @param   y  Column coordinate of tile.
   */
  private clearBorder(x: number, y: number): void {
    /*
     * Unusual method to remove border of rectangle in canvas. We remove every part of border as separate
     * filled rectangle.
     */
    this.context.clearRect(
      x * this.TILE_SIZE,
      y * this.TILE_SIZE,
      this.TILE_SIZE,
      2,
    );
    this.context.clearRect(
      x * this.TILE_SIZE,
      y * this.TILE_SIZE,
      2,
      this.TILE_SIZE,
    );
    this.context.clearRect(
      x * this.TILE_SIZE + this.TILE_SIZE - 2,
      y * this.TILE_SIZE,
      2,
      this.TILE_SIZE,
    );
    this.context.clearRect(
      x * this.TILE_SIZE,
      y * this.TILE_SIZE + this.TILE_SIZE - 2,
      this.TILE_SIZE,
      2,
    );
  }

  /**
   * Converts canvas pixel (x,y) coordinates into canvas cell coordinates.
   *
   * @param   x     Row coordinate of choosen pixel canvas.
   * @param   y     Column coordinate of choosen pixel canvas.
   * @returns       Returns object literal of converted coordinates.
   */
  private coordinatesToCell(x: number, y: number): ICoordinates {
    const convertedX = Math.floor(x / this.TILE_SIZE);
    const convertedY = Math.floor(y / this.TILE_SIZE);

    return { x: convertedX, y: convertedY };
  }

  /**
   * Function which changes cell three basics colours by certain values.
   *
   * @param   x     Row coordinate of cell to change.
   * @param   y     Column coordinate of cell to change.
   * @param   r     Value of red color added.
   * @param   g     Value of green color added.
   * @param   b     Value of blue color added.
   * @param   type  Value determining whether cell has to be lightened ("lighter" value) or
   *                darkened ("darken" value). Value is taken from {globalCompositeOperation} object.
   */
  private changeCellBackground(
    x: number,
    y: number,
    r: number,
    g: number,
    b: number,
    type: string,
  ): void {
    this.context.fillStyle =
      'rgb(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ')';
    this.context.globalCompositeOperation = type; // adds the fill color to existing pixels
    this.context.fillRect(
      x * this.TILE_SIZE,
      y * this.TILE_SIZE,
      this.TILE_SIZE,
      this.TILE_SIZE,
    );
    this.context.globalCompositeOperation = 'source-over'; // restore default composite operation
  }

  /**
   * Draws and animates border around certain cell coordinates.
   *
   * @param row       Row of cell's border to animate
   * @param column    Column of cell's border to animate
   */
  public drawAnimatedBorder(row: number, column: number): void {
    const convertedCoords: ICoordinates =
      this.camera.convertMapCoordinatesToCameraCoords(row, column);
    const { x, y } = convertedCoords;

    this.clearAlternativeBorderAnimation();

    if (convertedCoords) {
      this.setBorder(x, y, 'silver', true);
      this.alternativeBorderIntervalId = window.setInterval(
        this.animateAlternativeBorder,
        250,
      );
      this.alternativeBorderPosition = { x, y };
      this.isAlternativeBorderDrawn = true;
    }
  }

  @boundMethod
  private animateAlternativeBorder(): void {
    const { alternativeBorderPosition } = this;

    if (this.isAlternativeBorderDrawn) {
      this.clearBorder(
        alternativeBorderPosition.x,
        alternativeBorderPosition.y,
      );
      this.isAlternativeBorderDrawn = false;
    } else {
      this.setBorder(
        alternativeBorderPosition.x,
        alternativeBorderPosition.y,
        'silver',
        true,
      );
      this.isAlternativeBorderDrawn = true;
    }
  }

  /**
   * Method responsible for removing active alternative border (used for example in examine mode to look at cells)
   * animation.
   */
  public clearAlternativeBorderAnimation(): void {
    if (this.alternativeBorderPosition) {
      clearInterval(this.alternativeBorderIntervalId);
      this.clearBorder(
        this.alternativeBorderPosition.x,
        this.alternativeBorderPosition.y,
      );

      this.alternativeBorderIntervalId = null;
      this.alternativeBorderPosition = null;
    }
  }

  /**
   * Method responsible for removing any active border animations, by clearing animation interval and removing border
   * from canvas.
   */
  public clearBorderAnimation(): void {
    clearInterval(this.currentMousePosition.intervalId);
    this.clearBorder(this.currentMousePosition.x, this.currentMousePosition.y);
  }

  /**
   * Event listener for clicking mouse inside game view canvas
   */
  private mouseClickEventListener(e: MouseEvent): void {
    const row = Math.floor(e.offsetX / this.TILE_SIZE);
    const column = Math.floor(e.offsetY / this.TILE_SIZE);
    const convertedCoordinates = this.camera.getConvertedCoordinates(
      row,
      column,
    );

    this.camera.centerOnCoordinates(
      convertedCoordinates.x,
      convertedCoordinates.y,
    );

    this.notify(CANVAS_CELL_CLICK, {
      x: row,
      y: column,
    });
    // TODO add context actions later on
  }

  /**
   * Event listener for moving mouse over game view canvas.
   */
  private mouseMoveEventListener(e: MouseEvent): void {
    if (this.examineMode) {
      this.clearBorderAnimation();

      return;
    }
    /**
     * Row coordinate where border will be animated
     */
    const row = Math.floor(e.offsetX / this.TILE_SIZE);
    /**
     * Column coordinate where border will be animated
     */
    const column = Math.floor(e.offsetY / this.TILE_SIZE);
    /**
     * Position object containing converted view coordinates to level cell coordinates
     */
    const convertedCoordinates = this.camera.getConvertedCoordinates(
      row,
      column,
    );
    /**
     * Boolean variable indicating whether border is currently drawn around examined tile or not
     */
    let isBorderDrawn = true;
    /**
     * When mouse cursor is exactly on border of canvas, we terminate this function (otherwise row/column would
     * have value of -1)
     */
    if (
      e.offsetX < 0 ||
      e.offsetY < 0 ||
      e.offsetX >= this.rows * this.TILE_SIZE ||
      e.offsetY >= this.columns * this.TILE_SIZE
    ) {
      return;
    }
    /**
     * When converted view coordinates are beyond level, but still inside canvas, we terminate function, and clear
     * border animation
     */
    if (
      !this.currentMousePosition.isCursorBeyondLevel &&
      this.checkIfScreenCellOutsideOfLevel(
        convertedCoordinates.x,
        convertedCoordinates.y,
      )
    ) {
      clearInterval(this.currentMousePosition.intervalId); // we stop animation in last known mouse position
      this.clearBorder(
        this.currentMousePosition.x,
        this.currentMousePosition.y,
      ); // remove currently drawn border

      // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
      this.redrawCurrentStaticSprite();

      this.currentMousePosition.x = null; // reset current mouse position
      this.currentMousePosition.y = null;
      this.currentMousePosition.intervalId = null;
      this.currentMousePosition.isCursorBeyondLevel = true;

      return;
    }
    // when mouse first time enters canvas, we have to set initial values of currentMousePosition object
    if (
      this.currentMousePosition.x === null ||
      this.currentMousePosition.y === null
    ) {
      if (
        !this.checkIfScreenCellOutsideOfLevel(
          convertedCoordinates.x,
          convertedCoordinates.y,
        )
      ) {
        this.currentMousePosition.x = row;
        this.currentMousePosition.y = column;
        /**
         * We start animation, and we store interval id inside currentMousePosition object
         */
        this.currentMousePosition.intervalId = window.setInterval(
          animateBorder.bind(this),
          200,
        );
        this.currentMousePosition.isCursorBeyondLevel = false;
      }
    }
    // if currently examined tile where mouse cursor is, is different from last known tile where mouse cursor was
    if (
      !this.currentMousePosition.isCursorBeyondLevel &&
      (row !== this.currentMousePosition.x ||
        column !== this.currentMousePosition.y)
    ) {
      clearInterval(this.currentMousePosition.intervalId); // we stop animation in last cell
      this.clearBorder(
        this.currentMousePosition.x,
        this.currentMousePosition.y,
      ); // we clear border in last cell
      this.setBorder(row, column, 'silver'); // we set border in new cell

      // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
      this.redrawCurrentStaticSprite();

      this.currentMousePosition.x = row; // update current mouse position coordinates
      this.currentMousePosition.y = column;
      this.currentMousePosition.intervalId = window.setInterval(
        animateBorder.bind(this),
        200,
      );
    }
    function animateBorder(): void {
      const spriteAnimationId = this.sprites[`${row}x${column}`];
      const drawnTile = this.drawnTiles[`${row}x${column}`];
      const foggedTile = this.foggedTiles[`${row}x${column}`];

      if (!isBorderDrawn) {
        this.setBorder(row, column, 'silver');
        isBorderDrawn = true;
      } else {
        this.clearBorder(
          this.currentMousePosition.x,
          this.currentMousePosition.y,
        );
        isBorderDrawn = false;
        // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
        if (!spriteAnimationId) {
          if (drawnTile) {
            this.drawAnimatedImage(row, column, drawnTile);
          } else if (foggedTile) {
            this.drawAnimatedImage(row, column, foggedTile);
          }
        }
      }
    }
  }

  /**
   * Event listener function triggered when mouse leaves game view canvas.
   */
  private mouseLeaveEventListener(): void {
    const { isCursorBeyondLevel, intervalId, x, y } = this.currentMousePosition;
    /**
     * If current mouse position haven't been set (ie. it is null) we terminate function. This happens very rarely
     * when pointer is exactly on border of canvas and then leaves canvas
     */
    if (isCursorBeyondLevel && (!x || !y)) {
      return;
    }

    clearInterval(intervalId); // we stop animation in last known mouse position
    this.clearBorder(x, y); // remove currently drawn tile border

    // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
    this.redrawCurrentStaticSprite();

    this.currentMousePosition.x = null; // reset current mouse position
    this.currentMousePosition.y = null;
    this.currentMousePosition.intervalId = null;
    this.currentMousePosition.isCursorBeyondLevel = true;
  }

  /**
   * Redraws static (not animated) sprite in current mouse position.
   */
  private redrawCurrentStaticSprite(): void {
    this.redrawStaticSpriteAtPosition(this.currentMousePosition);
  }

  private redrawStaticSpriteAtPosition(position: ICoordinates): void {
    const { x, y } = position;
    const spriteAnimationId = this.sprites[`${x}x${y}`];
    const currentCell = this.drawnTiles[`${x}x${y}`];
    const currentFoggedCell = this.foggedTiles[`${x}x${y}`];

    if (!spriteAnimationId) {
      this.drawAnimatedImage(x, y, currentCell || currentFoggedCell);
    }
  }

  /**
   * Draws currently visible part of LevelModel object.
   * @param   level       LevelModel model object which visible part is going to be drawn.
   * @param   playerFov   Array of visible cells.
   */
  public drawScreen(level: LevelModel, playerFov: Cell[] = []): void {
    const cameraCoords = this.camera.getCoords();
    const cameraX = cameraCoords.x;
    const cameraY = cameraCoords.y;
    let examinedCell: Cell;

    this.currentPlayerFov = playerFov;

    for (let i = 0; i < config.LEVEL_WIDTH; i++) {
      // if cell column is greater than view height, we skip it
      if (i >= this.rows || cameraX + i >= config.LEVEL_WIDTH) {
        continue;
      }
      for (let j = 0; j < config.LEVEL_HEIGHT; j++) {
        // if cell row is greater than view width, we skip it
        if (j >= this.columns || cameraY + j >= config.LEVEL_HEIGHT) {
          continue;
        }
        examinedCell = level.getCell(cameraX + i, cameraY + j);

        if (!examinedCell) {
          console.warn(
            `Could not draw cell ${cameraX + i}x${cameraY + j}`,
            config,
          );
          continue;
        }

        if (playerFov.includes(examinedCell) || config.debugMode) {
          this.drawAnimatedImage(i, j, examinedCell, null);
          /**
           * We store information about Cell object of certain square in additional object, so we can later
           * redraw it in same place
           */
          this.drawnTiles[`${i}x${j}`] = examinedCell;
        } else if (examinedCell.wasDiscoveredByPlayer) {
          this.drawDarkenedImage(i, j, examinedCell.display);
          this.foggedTiles[`${i}x${j}`] = examinedCell;
        }
      }
    }
  }

  /**
   * Method which checks whether given view x and y position are outside level(ie. if x or y is greater than levels
   * width and height).
   *
   * @param   x  Row coordinate to check.
   * @param   y  Column coordinate to check.
   * @returns    Returns true if given coords are outside of level, returns false otherwise.
   */
  private checkIfScreenCellOutsideOfLevel(x: number, y: number): boolean {
    return (
      x < 0 || y < 0 || x >= config.LEVEL_WIDTH || y >= config.LEVEL_HEIGHT
    );
  }

  /**
   * Redraws game view.
   * @param   level       LevelModel object which visible part is going to be redrawn.
   * @param   playerFov   Array of visible cells
   */
  public refreshScreen(level: LevelModel, playerFov: Cell[]): void {
    this.clearGameWindow();
    this.drawScreen(level, playerFov);
  }

  public getScreen(): HTMLCanvasElement {
    return this.screen;
  }

  /**
   * Centers camera on given coordinates.
   *
   * @param position  New camera coordinates
   */
  public centerCameraOnCoordinates(position: ICoordinates): void {
    this.camera.centerOnCoordinates(position.x, position.y);
  }

  public enableExamineMode(): void {
    this.clearBorderAnimation();
    this.examineMode = true;
  }

  public disableExamineMode(): void {
    this.clearAlternativeBorderAnimation();
    this.examineMode = false;
    this.isAlternativeBorderDrawn = false;
  }

  /**
   * Clears all animations on game screen by resetting appropriate intervals.
   */
  public clearGameWindowAnimations(): void {
    clearInterval(this.globalAnimationFrameIntervalId);

    for (const n in this.sprites) {
      if (this.sprites.hasOwnProperty(n)) {
        window.clearInterval(this.sprites[n]);
      }
    }
  }

  /**
   * Updates entity position in temporaryDrawnTiles object. Used when monster move to correctly handle situation, where
   * at certain coords there is some graphical effect scheduled to show and in meantime monster changed its position.
   *
   * @param {EntityModel} entity
   */
  public updateEntityPositionInTemporaryDrawnSprites(
    entity: EntityModel,
  ): void {
    if (Object.keys(this.temporaryDrawnImages).length) {
      const entityEntry = Object.entries(this.temporaryDrawnImages).find(
        ([key, entry]) => entry.source === entity,
      );

      if (entityEntry) {
        const temporaryTile = entityEntry[1].sprite;
        const newPosition = this.camera.convertMapCoordinatesToCameraCoords(
          entity.position.x,
          entity.position.y,
        );
        const coordinates: string = `${newPosition.x}x${newPosition.y}`;

        delete this.temporaryDrawnImages[entityEntry[0]];
        this.temporaryDrawnImages[coordinates] = {
          sprite: temporaryTile,
          source: entity,
        };
      }
    }
  }

  /**
   * Show explosion gfx in specified tile on canvas.
   *
   * @param position  Coordinates object
   * @param source    Entity model on top of which explosion image should be drawn
   */
  public showExplosionAtPosition(
    position: ICoordinates,
    source?: EntityModel,
  ): void {
    const convertedPosition: ICoordinates =
      this.camera.convertMapCoordinatesToCameraCoords(position.x, position.y);

    if (convertedPosition) {
      this.setTemporaryImageWithTimeout(
        convertedPosition,
        MiscTiles.Explosion,
        ALTERNATIVE_TILE_SPRITE_TIMEOUT,
        source,
      );
    }
  }

  /**
   * Sets temporary image in certain canvas coords. Way it works: method creates field in temporaryDrawnImages
   * object. When function drawImage is called, it checks if coords with which it has been called exists in temporary
   * drawnImages object. If they does, it draws sprite from temporaryDrawnImages object instead of sprite from
   * function argument.
   *
   * @param canvasCoords  Coordinates on canvas where temporary image should be drawn
   * @param sprite        Name of sprite to draw, key in global tiledata object
   * @param timeout       Number of miliseconds after which temporary image should disappear
   */
  private setTemporaryImageWithTimeout(
    canvasCoords: ICoordinates,
    sprite: string,
    timeout: number,
    source?: EntityModel,
  ): void {
    const coordinates: string = `${canvasCoords.x}x${canvasCoords.y}`;

    this.temporaryDrawnImages[coordinates] = {
      sprite,
      source,
    };

    setTimeout(() => {
      if (source) {
        const convertedCoords = this.camera.convertMapCoordinatesToCameraCoords(
          source.position.x,
          source.position.y,
        );
        const key = `${convertedCoords.x}x${convertedCoords.y}`;

        delete this.temporaryDrawnImages[key];
        this.redrawStaticSpriteAtPosition(convertedCoords);
      } else {
        delete this.temporaryDrawnImages[coordinates];
        /**
         * We redraw original static sprite behind temporary sprite - otherwise it would've been redrawn during next
         * whole screen redraw.
         */
        this.redrawStaticSpriteAtPosition(canvasCoords);
      }
    }, timeout);
  }

  private getTemporaryDrawnImageKeyFromEntityPosition(
    position: ICoordinates,
  ): string {
    const convertedCoords = this.camera.convertMapCoordinatesToCameraCoords(
      position.x,
      position.y,
    );

    return `${convertedCoords.x}x${convertedCoords.y}`;
  }

  /**
   * Moves all temporary drawn images coords by specified vector.
   *
   * @param vector    Vector object
   */
  private moveTemporaryImagesCoords(vector: Vector): void {
    const newTemporaryDrawnImages: ITemporaryImages = {};

    Object.keys(this.temporaryDrawnImages).forEach((coord: string) => {
      const { x, y } = getPositionFromString(coord, 'x');
      const newCoords: string = `${x - vector.x}x${y - vector.y}`;

      newTemporaryDrawnImages[`${x - vector.x}x${y - vector.y}`] =
        this.temporaryDrawnImages[coord];
      setTimeout(() => {
        delete newTemporaryDrawnImages[newCoords];
      }, ALTERNATIVE_TILE_SPRITE_TIMEOUT);
    });

    this.temporaryDrawnImages = newTemporaryDrawnImages;
  }

  /**
   * Displays temporary message on game screen above (or beyond) certain cell.
   *
   * @param message       Message to show on game canvas
   * @param coordinates   Coordinates of cell near which message should be displayed
   * @param font          Name of font in which message should be displayed
   * @param timeout       Amount of milliseconds after which message should disappear
   */
  public showMessage(
    message: string,
    coordinates: ICoordinates = { x: 0, y: 0 },
    font: CanvasFonts = CanvasFonts.Avatar,
    timeout: number = 2000,
  ): void {
    const canvasContainer: HTMLDivElement = this.screenContainer;
    const textSpan: HTMLSpanElement = document.createElement('span');

    textSpan.innerText = message;
    textSpan.classList.add(`canvas-text-${font}`);
    /**
     * Append element at this point, so we can access its computed style properties.
     */
    canvasContainer.appendChild(textSpan);

    const { width: widthString, height: heightString } =
      window.getComputedStyle(textSpan);
    const width: number = parseInt(widthString, 10);
    const height: number = parseInt(heightString, 10);
    let left: number =
      coordinates.x * this.TILE_SIZE - width / 2 + this.TILE_SIZE;
    let top: number = coordinates.y * this.TILE_SIZE - height - 3;

    left = left < 0 ? coordinates.x * this.TILE_SIZE + 2 : left;
    top = top < 0 ? coordinates.y * this.TILE_SIZE + this.TILE_SIZE + 3 : top;

    if (left + width >= this.columns * this.TILE_SIZE) {
      left = coordinates.x * this.TILE_SIZE - width - 8;
    }

    textSpan.style.left = `${left}px`;
    textSpan.style.top = `${top}px`;

    const intervalTimeout = setTimeout(() => {
      this.removeTemporaryMessage(textSpan);
      this.temporaryShownMessages.delete(intervalTimeout);
    }, 2000);
    /**
     * Store data in map, so later we can retrieve it in remove all messages method.
     */
    this.temporaryShownMessages.set(intervalTimeout, textSpan);
  }

  /**
   * Removes from DOM temporarily shown message on canvas.
   *
   * @param message   HTMLSpanElement with message
   */
  @boundMethod
  private removeTemporaryMessage(message: HTMLSpanElement): void {
    if (this.screenContainer.contains(message)) {
      this.screenContainer.removeChild<HTMLSpanElement>(message);
    }
  }

  /**
   * Removes from DOM all temporarily shown messages.
   */
  public removeAllTemporaryMessages(): void {
    this.temporaryShownMessages.forEach(
      (messageElement: HTMLSpanElement, timeout: Timeout) => {
        if (clearTimeout) {
          clearTimeout(timeout);
        }
        if (this.screenContainer.contains(messageElement)) {
          this.screenContainer.removeChild(messageElement);
        }
      },
    );
  }
}
