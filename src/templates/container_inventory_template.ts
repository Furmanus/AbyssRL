export const containerInventoryTemplate = {
  content: `
    <div class="modal-inventory-wrapper">
        <h4 class="modal-inventory-header" data-element="heading">Take items from container</h4>
        <div class="modal-inventory-group-container">
            <ul class="modal-inventory-group-list" data-element="list"></ul>
            <p class="modal-inventory-container-empty" hidden data-element="emptyText">Container is empty</p>
        </div>
        <div class="modal-inventory-footer">
            <button class="inventory-action" data-element="putActionButton">put [P]</button>
            <button class="inventory-action" data-element="takeActionButton">take [T]</button>
        </div>
    </div>
  `,
  listItem: `
    <li class="modal-inventory-group-item" data-index="{{index}}">
        <span class="identifier">{{identifier}}</span>
        <canvas data-element="canvas" width="32" height="32"></canvas>    
        <span>{{description}}</span>
        <div role="checkbox" class="checkbox"></div>
    </li>
  `,
};
