const config = {
    LEVEL_WIDTH: 100,
    LEVEL_HEIGHT: 100
};
/**
 * Function which calculates and returns object with screen properties.
 * @returns {{SCREEN_WIDTH: number, SCREEN_HEIGHT: number, TILE_SIZE: number, ROWS: number, COLUMNS: number}}
 */
function getScreenProperties () {
    const tileSize = 32;
    //we calculate game window size. Game window should be approximately 3/4 of view size
    let x = Math.floor(window.innerWidth * 2 / 3);
    let y = Math.floor(window.innerHeight * 3 / 4);

    //we make sure that game window size dimensions are multiplication of tile size
    x = x - (x % tileSize);
    y = y - (y % tileSize);

    return {
        SCREEN_WIDTH: window.innerWidth,
        SCREEN_HEIGHT: window.innerHeight,
        TILE_SIZE: tileSize,
        ROWS: x / tileSize,
        COLUMNS: y / tileSize
    };
}

Object.assign(config, getScreenProperties());

export {config};