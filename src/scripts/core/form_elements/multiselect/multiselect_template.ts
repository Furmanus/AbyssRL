export const multiSelectTemplate = {
  content: `
    <div tabindex="0" class="select-wrapper" data-element="selectWrapper">
        <div role="combobox" class="select-box" data-element="selectBox">{{boxDescription}}</div>
        <ul class="select-list" data-element="selectList"></ul>
    </div>
  `,
};

export const multiSelectOptionTemplate = {
  content: `
    <li data-value="{{listItemValue}}" data-text="{{listItemText}}">{{listItemText}}</li>
  `,
};
