import { ModalView } from '../modal.view';
import { aboutGameModalTemplate } from './aboutGameModal.template';
import {
  AboutGameModalKeys,
  aboutGameModalKeyToPageMap,
  AboutGameModalPages,
  aboutGameModalPageToFooterText,
  aboutGameModalPageToHeadingText,
} from './aboutGameModal.constants';

const constructorToken = Symbol('AboutGameModalView');

type AboutGameModalTemplateElements = {
  [AboutGameModalPages.Main]: HTMLDivElement;
  [AboutGameModalPages.Keybindings]: HTMLDivElement;
  currentPage: HTMLParagraphElement;
  footer: HTMLDivElement;
};

export class AboutGameModalView extends ModalView<AboutGameModalTemplateElements> {
  private currentPage = AboutGameModalPages.Main;

  public constructor(token: symbol) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    super(aboutGameModalTemplate);
  }

  protected onWindowKeydownCallback = (e: KeyboardEvent): void => {
    const key = e.key.toLowerCase() as AboutGameModalKeys;

    if (Object.values(AboutGameModalKeys).includes(key)) {
      this.showPage(aboutGameModalKeyToPageMap[key]);
    }
  };

  private showPage(page: AboutGameModalPages): void {
    const { currentPage, footer } = this.template.elements;

    if (
      this.currentPage === AboutGameModalPages.Main &&
      page === AboutGameModalPages.Main
    ) {
      this.close();
    } else {
      for (const [pageName, pageElement] of Object.entries(
        this.template.elements,
      )) {
        if (
          Object.values(AboutGameModalPages).includes(
            pageName as AboutGameModalPages,
          )
        ) {
          if (page === pageName) {
            pageElement.hidden = false;
            this.currentPage = page as AboutGameModalPages;

            currentPage.innerText = aboutGameModalPageToHeadingText[page];
            footer.innerText = aboutGameModalPageToFooterText[page];
          } else {
            pageElement.hidden = true;
          }
        }
      }
    }
  }
}

export const aboutGameModalView = new AboutGameModalView(constructorToken);
