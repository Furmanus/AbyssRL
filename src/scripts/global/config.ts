import { getDataFromSessionStorage } from '../utils/storage_helper';
import { DevFormValues } from '../modal/developmentFeatures/devFeaturesModal.view';
import { SessionStorageKeys } from '../constants/storage';

interface IEnvs {
  RNG_SEED?: number;
  MODE?: 'development' | 'production' | 'test';
  TEST_DUNGEON_DATA?: string;
  TEST_PLAYER_DATA?: string;
}

declare global {
  interface Window {
    env: IEnvs;
  }
}

interface IConfig {
  LEVEL_WIDTH: number;
  LEVEL_HEIGHT: number;
  debugMode: boolean;
  debugOptions: {
    dungeonRooms: string[];
    noMonsters: boolean;
  };
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
  debugOptions: {
    dungeonRooms: [],
    noMonsters: false,
  },
  defaultLevelType: null,
  SCREEN_WIDTH: undefined,
  SCREEN_HEIGHT: undefined,
  TILE_SIZE: undefined,
  ROWS: undefined,
  COLUMNS: undefined,
};

const applicationConfigServiceToken = Symbol('Application config service');

/**
 * Function which calculates and returns object with screen properties.
 */
function getScreenProperties(): IExtendedConfig {
  const tileSize = 32;
  // we calculate game window size. Game window should be approximately 3/4 of view size
  let x = Math.floor((window.innerWidth * 2) / 3);
  let y = Math.floor((window.innerHeight * 3) / 4);

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

const storageData = getDataFromSessionStorage<DevFormValues>(
  SessionStorageKeys.DevFeatures,
);

if (storageData) {
  const {
    devDungeonLevelType,
    devDungeonHeight,
    devDungeonWidth,
    noMonsters,
    dungeonRoomTypes,
  } = storageData;

  devDungeonLevelType && (config.defaultLevelType = devDungeonLevelType);
  devDungeonWidth && (config.LEVEL_WIDTH = parseInt(devDungeonWidth, 10));
  devDungeonHeight && (config.LEVEL_HEIGHT = parseInt(devDungeonHeight, 10));
  noMonsters && (config.debugOptions.noMonsters = noMonsters);
  dungeonRoomTypes && (config.debugOptions.dungeonRooms = dungeonRoomTypes);
}

export class ApplicationConfigService {
  public constructor(token: Symbol) {
    if (token !== applicationConfigServiceToken) {
      throw new Error('Invalid constructor');
    }
  }

  public get rngSeedValue(): number | null {
    return this.#getEnvs()?.RNG_SEED || parseInt(process.env.RNG_SEED) || null;
  }

  public get isTestMode(): boolean {
    return this.#getEnvs()?.MODE === 'test';
  }

  public get isDevMode(): boolean {
    return process.env.MODE === 'development';
  }

  public get testDungeonData(): string | null {
    if (this.isDevMode || this.isTestMode) {
      return this.#getEnvs()?.TEST_DUNGEON_DATA || process.env.DUNGEON_JSON_PATH || null;
    }

    return null;
  }

  public get testPlayerData(): string | null {
    if (this.isDevMode || this.isTestMode) {
      return this.#getEnvs()?.TEST_PLAYER_DATA || process.env.PLAYER_JSON_PATH || null;
    }

    return null;
  }

  #getEnvs(): IEnvs {
    if (typeof window.env !== 'undefined') {
      return window.env;
    }

    return null;
  }
}

const applicationConfigService = new ApplicationConfigService(applicationConfigServiceToken);

if (applicationConfigService.isDevMode || applicationConfigService.isTestMode) {
  window._application.configService = applicationConfigService;
}

export {
  applicationConfigService,
  config,
};
