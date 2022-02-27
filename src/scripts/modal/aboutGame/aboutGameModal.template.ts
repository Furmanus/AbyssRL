import { AboutGameModalPages } from './aboutGameModal.constants';

export const aboutGameModalTemplate = {
  content: `
    <div class="aboutGameModal-wrapper">
      <h3>Abyss the Roguelike</h3>
      <p data-element="currentPage">Table of contents</p>
      <div class="aboutGameModal-content">
        <div class="aboutGameModal-list-common" data-element="${AboutGameModalPages.Main}">
          <ul>
            <li>
              <span>[K]</span>
              <span>Keybindings</span>
            </li>
          </ul>
        </div>
        <div class="aboutGameModal-list-common" data-element="${AboutGameModalPages.Keybindings}" hidden>
          <ul>
            <li>[a] Activate object</li>
            <li>[d] Drop item from inventory</li>
            <li>[i] Show inventory</li>
            <li>[u] Use item from inventory</li>
            <li>[x] Examine surroundings</li>
            <li>[>] Descend level</li>
            <li>[<] Ascend level</li>
            <li>[S] Save game</li>
            <li>[Q] Quit game</li>
          </ul>
        </div>
      </div>
      <footer class="aboutGameModal-footer" data-element="footer">
      </footer>
    </div>
  `,
};
