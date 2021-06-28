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
        </div>
        <div class="dungeon-options-container">
            <p>WiP</p>
        </div>
      </div>
      <div class="dungeon-options-submit-container">
          <button type="submit">Create</button>
      </div>
    </form>
  `,
};
