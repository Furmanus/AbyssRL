interface IConfig {
    LEVEL_WIDTH: number;
    LEVEL_HEIGHT: number;
    debugMode: boolean;
    defaultLevelType: string;
    SCREEN_WIDTH: number;
    SCREEN_HEIGHT: number;
    TILE_SIZE: number;
    ROWS: number;
    COLUMNS: number;
}
interface IExtendedConfig {
    SCREEN_WIDTH: number;
    SCREEN_HEIGHT: number;
    TILE_SIZE: number;
    ROWS: number;
    COLUMNS: number;
}

const config: IConfig = {
  LEVEL_WIDTH: 50,
  LEVEL_HEIGHT: 50,
  debugMode: false,
  defaultLevelType: null,
  SCREEN_WIDTH: undefined,
  SCREEN_HEIGHT: undefined,
  TILE_SIZE: undefined,
  ROWS: undefined,
  COLUMNS: undefined,
};
/**
 * Function which calculates and returns object with screen properties.
 */
function getScreenProperties(): IExtendedConfig {
  const tileSize = 32;
  // we calculate game window size. Game window should be approximately 3/4 of view size
  let x = Math.floor(window.innerWidth * 2 / 3);
  let y = Math.floor(window.innerHeight * 3 / 4);

  // we make sure that game window size dimensions are multiplication of tile size
  x = x - (x % tileSize);
  y = y - (y % tileSize);

  return {
    SCREEN_WIDTH: window.innerWidth,
    SCREEN_HEIGHT: window.innerHeight,
    TILE_SIZE: tileSize,
    ROWS: x / tileSize,
    COLUMNS: y / tileSize,
  };
}

Object.assign(config, getScreenProperties());

export { config };
