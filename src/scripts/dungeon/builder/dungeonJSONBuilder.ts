import type { SerializedDungeonState } from '../../state/applicationState.interfaces';
import { DungeonBranches } from '../constants/dungeonTypes.constants';
import { DungeonLevelBuilder, JSONBuilderLevelData } from './dungeonLevelBuilder';

type LevelNumbers = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type JSONDungeonBuilderInitData = Record<DungeonBranches, Record<LevelNumbers, JSONBuilderLevelData>>;

export class DungeonJSONBuilder {
    readonly #data: JSONDungeonBuilderInitData;
    readonly #serializedDungeonState: SerializedDungeonState = {
      dungeonStructure: {}
    } as SerializedDungeonState;

    public constructor(data: JSONDungeonBuilderInitData) {
      this.#data = data;
    }

    public static createFromJson(data: JSONDungeonBuilderInitData): SerializedDungeonState {
      return new DungeonJSONBuilder(data).#createBranches().#build();
    }

    #createBranches(): this {
      Object.keys(this.#data).forEach((branchName: DungeonBranches) => this.#createBranch(branchName));

      return this;
    }

    #createBranch(branchName: DungeonBranches): this {
      this.#serializedDungeonState.dungeonStructure[branchName] = {};

      for (const [levelNumber, levelData] of Object.entries(this.#data[branchName])) {
        this.#serializedDungeonState.dungeonStructure[branchName][parseInt(levelNumber)] = DungeonLevelBuilder.create(levelData).build();
      }

      return this;
    }

    #build(): SerializedDungeonState {
      return this.#serializedDungeonState;
    }
}
