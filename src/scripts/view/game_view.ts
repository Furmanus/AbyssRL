/**
 * Created by Lukasz Lach on 2017-04-24.
 */
import {
    tileset,
} from '../global/tiledata';
import {Camera} from './camera';
import {Observer} from '../core/observer';
import {CANVAS_CELL_CLICK} from '../constants/game_actions';
import {config} from '../global/config';
import {ICoordinates, IStringDictionary} from '../interfaces/common';
import {Cell} from '../model/dungeon/cells/cell_model';
import {LevelModel} from '../model/dungeon/level_model';

interface IMousePosition {
    x: number;
    y: number;
    intervalId: number;
    isCursorBeyondLevel: boolean;
}
interface ISprites {
    [prop: string]: number;
}
interface IDrawnTiles {
    [prop: string]: Cell;
}

export class GameView extends Observer {
    private rows: number;
    private columns: number;
    private TILE_SIZE: number;
    private tileset: CanvasImageSource;
    /**
     * Global animation frame for all animated sprites. Changes every 250ms.
     */
    private globalAnimationFrame: number = 0;
    private currentMousePosition: IMousePosition;
    private screen: HTMLCanvasElement = document.getElementById('game') as HTMLCanvasElement;
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
    public camera: Camera;
    /**
     *
     * @param width     Width of view(in pixels).
     * @param height    Height of view(in pixels).
     * @param tileSize  Size of single tile image(in pixels). We assume tiles are always square.
     * @param tileSet   <Img> Html tag with source pointing at image with tileset.
     */
    constructor(width: number, height: number, tileSize: number = 32, tileSet: CanvasImageSource) {
        super();

        this.TILE_SIZE = tileSize;
        this.rows = width / this.TILE_SIZE;
        this.columns = height / this.TILE_SIZE;
        this.tileset = tileSet;
        this.camera = new Camera(0, 0, this.rows, this.columns);
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

        window.setInterval(() => {
            if (this.globalAnimationFrame < 4) {
                this.globalAnimationFrame++;
            } else {
                this.globalAnimationFrame = 0;
            }
        }, 250);
    }
    protected attachEvents(): void {
        this.screen.addEventListener('click', this.mouseClickEventListener.bind(this));
        this.screen.addEventListener('mousemove', this.mouseMoveEventListener.bind(this));
        this.screen.addEventListener('mouseleave', this.mouseLeaveEventListener.bind(this));
    }
    /**
     * Draws 32x32 pixels tile on game view at certain coordinates. Tile is choosen from game tileset from i row and j column.
     * @param   x  Row position where tile on game view will be drawn
     * @param   y  Column position where tile on game view will be drawn
     * @param   i  Row position from tileset where from tile will be choosen to draw
     * @param   j  Column position from tileset where from tile will be choosen to draw
     */
    private drawImage(x: number, y: number, i: number, j: number): void {
        this.context.drawImage(
            this.tileset,
            i * this.TILE_SIZE,
            j * this.TILE_SIZE,
            32,
            32,
            x * this.TILE_SIZE,
            y * this.TILE_SIZE,
            32,
            32,
        );
    }
    /**
     * Draws 32x32 pixels tile on game view at given coordinates. Tile is choosen from game tileset from x row
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
        this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation.DARKEN);
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
    private drawAnimatedImage(x: number, y: number, cell: Cell, light?: string): number {
        if (!cell) {
            return;
        }
        const isCellNotVisible: boolean = !!this.foggedTiles[`${x}x${y}`];
        let tile: string;
        let i: number;
        let j: number;
        let framesNumber: number;
        let interval;

        if (cell.entity) {
            tile = cell.entity.display;
        } else if (cell.inventory.length) {
            tile = cell.inventory[0].display;
        } else {
            tile = cell.display;
        }

        i = tileset[tile].x;
        j = tileset[tile].y;
        framesNumber = tileset[tile].frames; // number of animation frames of selected tile
        light = isCellNotVisible ? 'DARKEN' : light;
        // if there is only one frame to animate, it is simply drawn
        if (framesNumber === 1) {
            this.drawImage(x, y, i, j); // if image isn't animated, we just draw it and end function

            if (light && this.globalCompositeOperation[light]) {
                /**
                 * If optional parameter "light" was passed, cell background color is changed
                 */
                this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation[light]);
            }
            return null;
        } else {
            this.drawImage(x, y, i + this.globalAnimationFrame % framesNumber, j); // we draw frame of animation

            interval = window.setInterval(() => {
                this.drawImage(x, y, i + this.globalAnimationFrame % framesNumber, j);

                if (light) {
                    /**
                     * If optional parameter "light" was passed, cell background color is changed
                     */
                    this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation[light]);
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
        for (const n in this.sprites) {
            if (this.sprites.hasOwnProperty(n)) {
                window.clearInterval(this.sprites[n]);
            }
        }
        // we reset this.sprites and this.tiles objects
        this.sprites = {};
        this.drawnTiles = {};
        this.foggedTiles = {};

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
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
    public changeGameScreenSize(newWidth: number, newHeight: number, level: LevelModel, playerFov: Cell[]): void {
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
     * @param   x         Row coordinate of tile.
     * @param   y         Column coordinate of tile.
     * @param   color     Colour of border.
     */
    private setBorder(x: number, y: number, color: string): void {
        this.context.fillStyle = color;
        /*
        * Unusual method to draw border of rectangle in canvas. We draw every part of border as separate filled
        * rectangle, so we can later clear it in separate method.
        */
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, 2);
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.fillRect(x * this.TILE_SIZE + this.TILE_SIZE - 2, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE + this.TILE_SIZE - 2, this.TILE_SIZE, 2);
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
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, 2);
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.clearRect(x * this.TILE_SIZE + this.TILE_SIZE - 2, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE + this.TILE_SIZE - 2, this.TILE_SIZE, 2);
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

        return {x: convertedX, y: convertedY};
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
    private changeCellBackground(x: number, y: number, r: number, g: number, b: number, type: string): void {
        this.context.fillStyle = 'rgb(' + Math.floor(r) + ","  + Math.floor(g) + "," + Math.floor(b) + ')';
        this.context.globalCompositeOperation = type; // adds the fill color to existing pixels
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
        this.context.globalCompositeOperation = 'source-over'; // restore default composite operation
    }
    /**
     * Event listener for clicking mouse inside game view canvas
     */
    private mouseClickEventListener(e: MouseEvent): void {
        const row = Math.floor(e.offsetX / this.TILE_SIZE);
        const column = Math.floor(e.offsetY / this.TILE_SIZE);
        const convertedCoordinates = this.camera.getConvertedCoordinates(row, column);

        this.camera.centerOnCoordinates(convertedCoordinates.x, convertedCoordinates.y);

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
        const convertedCoordinates = this.camera.getConvertedCoordinates(row, column);
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
            this.checkIfScreenCellOutsideOfLevel(convertedCoordinates.x, convertedCoordinates.y)
        ) {
            clearInterval(this.currentMousePosition.intervalId); // we stop animation in last known mouse position
            this.clearBorder(this.currentMousePosition.x, this.currentMousePosition.y); // remove currently drawn border

            // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
            this.redrawCurrentStaticSprite();

            this.currentMousePosition.x = null; // reset current mouse position
            this.currentMousePosition.y = null;
            this.currentMousePosition.intervalId = null;
            this.currentMousePosition.isCursorBeyondLevel = true;

            return;
        }
        // when mouse first time enters canvas, we have to set initial values of currentMousePosition object
        if (this.currentMousePosition.x === null || this.currentMousePosition.y === null) {
            if (!this.checkIfScreenCellOutsideOfLevel(convertedCoordinates.x, convertedCoordinates.y)) {
                this.currentMousePosition.x = row;
                this.currentMousePosition.y = column;
                /**
                 * We start animation, and we store interval id inside currentMousePosition object
                 */
                this.currentMousePosition.intervalId = window.setInterval(animateBorder.bind(this), 120);
                this.currentMousePosition.isCursorBeyondLevel = false;
            }
        }
        // if currently examined tile where mouse cursor is, is different from last known tile where mouse cursor was
        if (
            !this.currentMousePosition.isCursorBeyondLevel &&
            (row !== this.currentMousePosition.x || column !== this.currentMousePosition.y)
        ) {
            clearInterval(this.currentMousePosition.intervalId); // we stop animation in last cell
            this.clearBorder(this.currentMousePosition.x, this.currentMousePosition.y); // we clear border in last cell
            this.setBorder(row, column, 'silver'); // we set border in new cell

            // if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
            this.redrawCurrentStaticSprite();

            this.currentMousePosition.x = row; // update current mouse position coordinates
            this.currentMousePosition.y = column;
            this.currentMousePosition.intervalId = window.setInterval(animateBorder.bind(this), 120);
        }
        function animateBorder(): void {
            const spriteAnimationId = this.sprites[`${row}x${column}`];
            const drawnTile = this.drawnTiles[`${row}x${column}`];
            const foggedTile = this.foggedTiles[`${row}x${column}`];

            if (!isBorderDrawn) {
                this.setBorder(row, column, 'silver');
                isBorderDrawn = true;
            } else {
                this.clearBorder(this.currentMousePosition.x, this.currentMousePosition.y);
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
        const {
            isCursorBeyondLevel,
            intervalId,
            x,
            y,
        } = this.currentMousePosition;
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
        const {
            x,
            y,
        } = this.currentMousePosition;
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
        let examinedCell;

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
        return (x < 0 || y < 0 || x >= config.LEVEL_WIDTH || y >= config.LEVEL_HEIGHT);
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
}
