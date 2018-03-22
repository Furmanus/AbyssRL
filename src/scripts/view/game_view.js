/**
 * Created by Lukasz Lach on 2017-04-24.
 */
import tileset from './tiledata.js';
import Camera from './camera.js';
import game from './../game/game.js';

class GameView{

    /**
     *
     * @param {number} width - Width of view(in pixels).
     * @param {number} height - Height of view(in pixels).
     * @param {number} tileSize - Size of single tile image(in pixels). We assume tiles are always square.
     * @param {Object} tileSet - {@code <Img>} Html tag with source pointing at image with tileset.
     * @param {Object} level - {@code Level} object which is about to be drawn.
     */
    constructor(width, height, tileSize, tileSet, level){

        this.TILE_SIZE = tileSize;
        this.screen = document.getElementById('game');
        this.rows = width / this.TILE_SIZE;
        this.columns = height / this.TILE_SIZE;
        this.tileset = tileSet;
        this.level = level;
        this.camera = new Camera(0,0, this.rows, this.columns);

        /*
        Object holding coordinates of current mouse position on canvas. Used to draw rectangle in _mouseMoveEventListener
         */
        this.currentMousePosition = {
            x: null, //row where currently mouse cursor is
            y: null,  //column where currently mouse cursor is
            intervalId: null, //unique id from setInterval method where function responsible for drawing and clearing rectangle border around certain tile
            isCursorBeyondLevel: true //boolean variable determining whether mouse cursor is beyond level cells coordinates but still inside canvas
        };

        /*
        * Object literal which contains currently drawn animated sprites on view. Data is stored as JSON where keys are map coordinates where object is stored (for example '3x5'). Values
        * are intervals returned by drawAnimatedImage.
        */
        this.sprites = {};

        /*
        * Object which contains all currently drawn not animated sprites on view. Keys are equal to map coordinates (for example '3x5'). Values are equal to names tile information
        * from tiledata.js module
        */
        this.drawnTiles = {};
        /*
        Object literal containing string values used for setting canvas globalCompositeOperation.
         */
        this.globalCompositeOperation = {

            'LIGHTER': 'lighter',
            'DARKEN': 'darken',
            'LIGHTEN': 'lighten',

        };

        /*Context from game view canvas.*/
        this.context = this.screen.getContext('2d');
        this.context.canvas.width = width;
        this.context.canvas.height = height;

        this.initialize();
    }

    initialize(){
        this.attachEvents();
    }

    attachEvents(){
        window.addEventListener('resize', this.resizeGameWindow.bind(this));
        this.screen.addEventListener('click', this._mouseClickEventListener.bind(this));
        this.screen.addEventListener('mousemove', this._mouseMoveEventListener.bind(this));
        this.screen.addEventListener('mouseleave', this._mouseLeaveEventListener.bind(this));
    }

    /**
     * Draws 32x32 pixels tile on game view at certain coordinates. Tile is choosen from game tileset from {@code i} row and {@code j} column.
     * @param {number} x - Row position where tile on game view will be drawn
     * @param {number} y - Column position where tile on game view will be drawn
     * @param {number} i - Row position from tileset where from tile will be choosen to draw
     * @param {number} j - Column position from tileset where from tile will be choosen to draw
     */
    drawImage(x, y, i, j){

        this.context.drawImage(this.tileset, i*this.TILE_SIZE, j*this.TILE_SIZE, 32, 32, x*this.TILE_SIZE, y*this.TILE_SIZE, 32, 32);
    }

    /**
     * Draws 32x32 pixels tile on game view at given coordinates. Tile is choosen from game tileset from {@code x} row and {@code y} column. Tile is not animated and is darkened.
     * If tile has more than one frame (is animated normally), only first frame is drawn.
     * @param {number} x - Row position where tile on game view will be drawn
     * @param {number} y - Column position where tile on game view will be drawn
     * @param {string} tile - String parameter equal to String key object in tiledata.js file which contains information about drawn sprite.
     */
    drawDarkenedImage(x, y, tile){

        let i = tileset[tile].x;
        let j = tileset[tile].y;

        this.drawImage(x, y, i, j);
        this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation.DARKEN);
    }

    /**
     * Draws 32x32 pixels animated sprite. Spritesheet is selected from {@code GameView} {@code tileset} field. Spritesheet starts at {@code x} row and {@code y} column of tileset and contains next {@code framesNumber}
     * 32x32 images.
     * @param {number} x - This parameter is equal to row on canvas where animated sprite is going to be drawn.
     * @param {number} y - This parameter is equal to column on canvas where animated sprite is going to be drawn.
     * @param {Cell} cell - {@code Cell} single map cell which display is being drawn.
     * @param {string} light - Optional: parameter indicating whether cell will be lightened or darkened. Accepts only two values: "LIGHTEN" or "DARKEN".
     * @returns {Object} Returns object containing interval returned by {@code setInterval} method which is responsible for animating sprite and current animation frame.
     */
    drawAnimatedImage(x, y, cell, light){

        let tile = cell.display;
        let i = tileset[tile].x;
        let j = tileset[tile].y;
        let framesNumber = tileset[tile].frames; //number of animation frames of certain tile

        //if there is only one frame to animate, it is simply drawn
        if(framesNumber === 1){

            this.drawImage(x, y, i, j); //if image isn't animated, we just draw it and end function

            if(light){

                this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation[light]); // if optional parameter "light" was passed, cell background color is changed
            }

            return null;
        }else {

            //otherwise we increase cell animation frame by one, in case when user repeatly makes action that redraws view(to avoid displaying same frame during that time)
            if(cell.animationFrame === framesNumber){

                cell.animationFrame = 1;
            }else{

                cell.animationFrame++;
            }

            this.drawImage(x, y, i + cell.animationFrame - 1, j); //we draw frame of animation

            let animate = drawSprite.bind(this); //bind drawSprite function to object where it was defined
            let interval = setInterval(animate, 250);

            this.sprites[x + 'x' + y] = interval; //we store interval in this.sprites object, so we can later stop it in clearGameWindow function
            
            return interval;
        }

        function drawSprite(){

            this.drawImage(x, y, i + cell.animationFrame - 1, j);

            if(light){

                this.changeCellBackground(x, y, 50, 50, 50, this.globalCompositeOperation[light]); // if optional parameter "light" was passed, cell background color is changed
            }

            if(cell.animationFrame === framesNumber){

                cell.animationFrame = 1;
            }else{

                cell.animationFrame++;
            }
        }
    }

    /**
     * Clears game window canvas. First all animations are stopped (intervals returned by drawAnimatedImage function) and then whole canvas context is cleared.
     */
    clearGameWindow(){
        //we stop all animations currently being displayed on view
        for(let n in this.sprites){

            clearInterval(this.sprites[n]);
        }
        //we reset this.sprites and this.tiles objects
        this.sprites = {};
        this.drawnTiles = {};

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    /**
     * Function responsible for resizing game window size and all other canvas/divs(messages, info and map) whenever browser window is resized.
     * Game window should be always about 2/3 and 3/4 of window width/height.
     */
    resizeGameWindow(){

        //we calculate new game window size. Game window should be approximately 3/4 of view size
        let x = Math.floor(window.innerWidth * 2 / 3);
        let y = Math.floor(window.innerHeight * 3 / 4);

        //we make sure that new game window size dimensions are multiplication of tile size
        x = x - (x % this.TILE_SIZE);
        y = y - (y % this.TILE_SIZE);

        this.context.canvas.width = x;
        this.context.canvas.height = y;

        this.rows = x / this.TILE_SIZE;
        this.columns = y / this.TILE_SIZE;

        //size of other canvas depends on size of game window

        require('../entry.js').infoScreen.changeSize(window.innerWidth - x - 30, y);
        require('../entry.js').messagesScreen.changeSize(x, window.innerHeight - y - 40);
        require('../entry.js').mapScreen.changeSize(window.innerWidth - x - 30, window.innerHeight - y - 40);

        // TODO SET NEW CAMERA DIMENSIONS LATER ON
        // TODO REDRAW SCREEN
    }

    /**
     * Sets a border around certain tile.
     * @param {number} x - Row coordinate of tile.
     * @param {number} y - Column coordinate of tile.
     * @param {string} color - Colour of border.
     * @private
     */
    _setBorder(x, y, color){

        this.context.fillStyle = color;

        /*
        * Unusual method to draw border of rectangle in canvas. We draw every part of border as separate filled rectangle, so we can later clear it in separate method.
        */
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, 2);
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.fillRect(x * this.TILE_SIZE + this.TILE_SIZE - 2, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE + this.TILE_SIZE - 2, this.TILE_SIZE, 2);
    }

    /**
     * Method responsible for removing border from certain tile.
     * @param {number} x - Row coordinate of tile.
     * @param {number} y - Column coordinate of tile.
     * @private
     */
    _clearBorder(x, y){

        /*
         * Unusual method to remove border of rectangle in canvas. We remove every part of border as separate filled rectangle.
         */
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, 2);
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.clearRect(x * this.TILE_SIZE + this.TILE_SIZE - 2, y * this.TILE_SIZE, 2, this.TILE_SIZE);
        this.context.clearRect(x * this.TILE_SIZE, y * this.TILE_SIZE + this.TILE_SIZE - 2, this.TILE_SIZE, 2);
    }

    /**
     * Converts canvas pixel (x,y) coordinates into canvas cell coordinates.
     * @param {number} x - Row coordinate of choosen pixel canvas.
     * @param {number} y - column coordinate of choosen pixel canvas.
     * @returns {{x: number, y: number}} - Returns object literal of converted coordinates.
     * @private
     */
    _coordinatesToCell(x, y){

        let convertedX = Math.floor(x / this.TILE_SIZE);
        let convertedY = Math.floor(y / this.TILE_SIZE);

        return {x: convertedX, y: convertedY}
    }

    /**
     * Function which changes cell three basics colours by certain values.
     * @param {number} x - Row coordinate of cell to change.
     * @param {number} y - Column coordinate of cell to change.
     * @param {number} r - Value of red color added.
     * @param {number} g - Value of green color added.
     * @param {number} b - Value of blue color added.
     * @param {string} type - Value determining whether cell has to be lightened ("lighter" value) or darkened ("darken" value). Value is taken from {globalCompositeOperation} object.
     */
    changeCellBackground(x, y, r, g, b, type){

        this.context.fillStyle = "rgb(" + Math.floor(r) + ","  + Math.floor(g) + "," + Math.floor(b) + ")";
        this.context.globalCompositeOperation = type; // adds the fill color to existing pixels
        this.context.fillRect(x * this.TILE_SIZE, y * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
        this.context.globalCompositeOperation = "source-over"; // restore default composite operation
    }

    /**
     * Event listener for clicking mouse inside game view canvas
     * @param {Object} e - Event(mouse click) which triggered this function.
     * @private
     */
    _mouseClickEventListener(e){

        let row = Math.floor(e.offsetX / this.TILE_SIZE);
        let column = Math.floor(e.offsetY / this.TILE_SIZE);
        let convertedCoordinates = this.camera.getConvertedCoordinates(row, column);

        this.camera.centerOnCoordinates(convertedCoordinates.x, convertedCoordinates.y);

        this.clearGameWindow();
        this.drawScreen();
        //TODO add context actions later on
        //TODO remove function
        // function getDistance(x1, y1, x2, y2){
        //
        //     return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        // }
    }

    /**
     * Event listener for moving mouse over game view canvas.
     * @param {Object} e - Event object(mouse moving over game view canvas) which triggered this function.
     * @private
     */
    _mouseMoveEventListener(e){

        let row = Math.floor(e.offsetX / this.TILE_SIZE); // row coordinate where border will be animated
        let column = Math.floor(e.offsetY / this.TILE_SIZE); // column coordinate where border will be animated
        let isBorderDrawn = true; // boolean variable indicating whether border is currently drawn around examined tile or not
        let convertedCoordinates = this.camera.getConvertedCoordinates(row, column); // object containing converted view coordinates to level cell coordinates

        //when mouse cursor is exactly on border of canvas, we terminate this function (otherwise row/column would have value of -1)
        if(e.offsetX < 0 || e.offsetY < 0 || e.offsetX >= this.rows * this.TILE_SIZE || e.offsetY >= this.columns * this.TILE_SIZE){

            return;
        }

        //when converted view coordinates are beyond level, but still inside canvas, we terminate function, and clear border animation
        if(!this.currentMousePosition.isCursorBeyondLevel && this._checkIfScreenCellOutsideOfLevel(convertedCoordinates.x, convertedCoordinates.y)){

            clearInterval(this.currentMousePosition.intervalId); //we stop animation in last known mouse position
            this._clearBorder(this.currentMousePosition.x, this.currentMousePosition.y); //remove currently drawn tile border

            //if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
            if(!this.sprites[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]){

                this.drawAnimatedImage(this.currentMousePosition.x, this.currentMousePosition.y, this.drawnTiles[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]);
            }

            this.currentMousePosition.x = null; //reset current mouse position
            this.currentMousePosition.y = null;
            this.currentMousePosition.intervalId = null;
            this.currentMousePosition.isCursorBeyondLevel = true;

            return;
        }

        //when mouse first time enters canvas, we have to set initial values of currentMousePosition object
        if(this.currentMousePosition.x === null || this.currentMousePosition.y === null){

            if(!this._checkIfScreenCellOutsideOfLevel(convertedCoordinates.x, convertedCoordinates.y)){

                this.currentMousePosition.x = row;
                this.currentMousePosition.y = column;
                this.currentMousePosition.intervalId = setInterval(animateBorder.bind(this), 120); // we start animation, and we store interval id inside currentMousePosition object
                this.currentMousePosition.isCursorBeyondLevel = false;
            }
        }

        //if currently examined tile where mouse cursor is, is different from last known tile where mouse cursor was
        if(!this.currentMousePosition.isCursorBeyondLevel && (row !== this.currentMousePosition.x || column !== this.currentMousePosition.y)) {

            clearInterval(this.currentMousePosition.intervalId); // we stop animation in last cell
            this._clearBorder(this.currentMousePosition.x, this.currentMousePosition.y); // we clear border in last cell
            this._setBorder(row, column, 'silver'); // we set border in new cell

            //if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
            if(!this.sprites[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]) {

                this.drawAnimatedImage(this.currentMousePosition.x, this.currentMousePosition.y, this.drawnTiles[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]);
            }

            this.currentMousePosition.x = row; // update current mouse position coordinates
            this.currentMousePosition.y = column;
            this.currentMousePosition.intervalId = setInterval(animateBorder.bind(this), 120); // we start animation, and we store interval id inside currentMousePosition object
        }

        function animateBorder(){

            if(!isBorderDrawn){

                this._setBorder(row, column, 'silver');
                isBorderDrawn = true;
            }else{

                this._clearBorder(this.currentMousePosition.x, this.currentMousePosition.y);
                isBorderDrawn = false;

                //if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
                if(!this.sprites[row + 'x' + column]){

                    this.drawAnimatedImage(row, column, this.drawnTiles[row + 'x' + column]);
                }
            }
        }
    }

    /**
     * Event listener function triggered when mouse leaves game view canvas.
     * @private
     */
    _mouseLeaveEventListener(){

        //if current mouse position haven't been set (ie. it is null) we terminate function. This happens very rarely, when pointer is exactly on border of canvas, and then leaves canvas
        if(this.currentMousePosition.isCursorBeyondLevel && (!this.currentMousePosition.x || !this.currentMousePosition.y)){

            return;
        }

        clearInterval(this.currentMousePosition.intervalId); //we stop animation in last known mouse position
        this._clearBorder(this.currentMousePosition.x, this.currentMousePosition.y); //remove currently drawn tile border

        //if sprite wasn't animated we redraw it (because otherwise it would have empty borders)
        if(!this.sprites[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]){

            this.drawAnimatedImage(this.currentMousePosition.x, this.currentMousePosition.y, this.drawnTiles[this.currentMousePosition.x + 'x' + this.currentMousePosition.y]);
        }

        this.currentMousePosition.x = null; //reset current mouse position
        this.currentMousePosition.y = null;
        this.currentMousePosition.intervalId = null;
        this.currentMousePosition.isCursorBeyondLevel = true;
    }

    /**
     * Draws currently visible part of {@code Level} object.
     */
    drawScreen(){

        let drawResult = null; //returned object from drawAnimatedImage method. Used to pass currently displayed animated image frame to Cell object

        for(let i=0; i<this.level.cells.length; i++){
            //if cell column is greater than view height, we skip it
            if(i >= this.rows || this.camera.getCoords().x + i >= game.options.LEVEL_WIDTH){

                continue;
            }

            for(let j=0; j<this.level.cells[i].length; j++){
                //if cell row is greater than view width, we skip it
                if(j >= this.columns || this.camera.getCoords().y + j >= game.options.LEVEL_HEIGHT){

                    continue;
                }

                this.drawAnimatedImage(i, j, this.level.cells[this.camera.getCoords().x + i][this.camera.getCoords().y + j], null);

                this.drawnTiles[i + 'x' + j] = this.level.cells[this.camera.getCoords().x + i][this.camera.getCoords().y + j]; //we store information about Cell object of certain square in additional object, so we can later redraw it in same place
            }
        }
    }

    /**
     * Method which checks whether given view x and y position are outside level(ie. if x or y is greater than levels width and height)
     * @param {number} x - Row coordinate to check.
     * @param {number} y - Column coordinate to check.
     * @private
     * @returns {boolean} Returns true if given coords are outside of level, returns false otherwise.
     */
    _checkIfScreenCellOutsideOfLevel(x, y){

        return (x < 0 || y < 0 || x >= game.options.LEVEL_WIDTH || y >= game.options.LEVEL_HEIGHT);
    }

    /**
     * Redraws game view.
     */
    refreshScreen(){

        this.clearGameWindow();
        this.drawScreen();
    }

    getScreen(){

        return this.screen;
    }
}

module.exports = GameView;
