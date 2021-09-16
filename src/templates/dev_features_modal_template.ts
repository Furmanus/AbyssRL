import { DungeonVaults } from '../scripts/constants/vaults';

export const devFeatureModalTemplate = {
  content: `
    <form class="devFeatureModalForm" data-element="devForm">
      <h2>Development Tools</h2>
      <div class="form-content-container">
        <div class="dungeon-options-container">
          <div class="space-down">
            <label for="devDungeonWidth">Dungeon width</label>
            <input id="devDungeonWidth" name="devDungeonWidth" data-element="dungeonWidthInput" type="number" placeholder="Dungeon width"/>
          </div>
          <div class="space-down">
            <label for="devDungeonHeight">Dungeon height</label>
            <input id="devDungeonHeight" name="devDungeonHeight" data-element="dungeonHeightInput" type="number" placeholder="Dungeon height"/>
          </div>
          <div class="space-down">
            <label for="devDungeonLevelType">Level type</label>
            <select id="devDungeonLevelType" name="devDungeonLevelType" data-element="levelTypeSelect">
              <option value="" selected>Unset</option>
              <option value="cavern">Cavern</option>
              <option value="dungeon">Dungeon</option>
              <option value="arena">Arena</option>
            </select>
          </div>
          <div class="space-down">
            <label for="dungeonRoomTypes">Dungeon special rooms</label>
            <select id="dungeonRoomTypes" name="dungeonRoomTypes" data-placeholder="None" data-element="dungeonRoomTypesSelect" multiple>
              <option value="${DungeonVaults.RoomWithBed}">Room with bed</option>
              <option value="${DungeonVaults.RoomWithBarrel}">Room with barrel</option>
            </select>
          </div>
          <div class="flex-row space-down">
            <label for="noMonsters">No monsters</label>
            <input type="checkbox" id="noMonsters" name="noMonsters" data-element="noMonstersCheckbox" placeholder="No monsters"/>
          </div>
        </div>
        <div class="dungeon-options-container">
          <div class="space-down">
            <label for="monsterSpawn">Spawn monster</label>
            <select id="monsterSpawn" name="monsterSpawn" data-element="monsterSpawnSelect">
              <option value="" selected>Select monster</option>
            </select>
          </div>
          <div class="space-down heal-button-container">
            <button type="button" data-element="healPlayerButton">Heal player</button>
          </div>
        </div>
      </div>
      <div class="dungeon-options-submit-container">
          <button type="submit">Create</button>
      </div>
    </form>
  `,
};
