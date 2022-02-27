export enum AboutGameModalKeys {
  Keybindings = 'k',
  Escape = 'escape',
}

export enum AboutGameModalPages {
  Main = 'main',
  Keybindings = 'keybindings',
}

export const aboutGameModalKeyToPageMap = {
  [AboutGameModalKeys.Keybindings]: AboutGameModalPages.Keybindings,
  [AboutGameModalKeys.Escape]: AboutGameModalPages.Main,
};

export const aboutGameModalPageToHeadingText = {
  [AboutGameModalPages.Main]: 'Table of contents',
  [AboutGameModalPages.Keybindings]: 'Keybindings',
};

export const aboutGameModalPageToFooterText = {
  [AboutGameModalPages.Main]: '',
  [AboutGameModalPages.Keybindings]: 'Press esc to go back',
};
