export const singleSelectTemplate = {
  content: `
    <div tabindex="0" class="select-wrapper" data-element="singleSelectWrapper">
        <div role="combobox" class="select-box" data-element="singleSelectBox">{{boxDescription}}</div>
        <ul class="select-list-single" data-element="singleSelectList"></ul>
    </div>
  `,
};

export const singleSelectOptionTemplate = {
  content: `
    <li data-value="{{listItemValue}}" data-text="{{listItemText}}">{{listItemText}}</li>
  `,
};
