import { MessagesView } from './messages.view';
import { config } from '../global/config';
import { BaseController } from '../core/base.controller';

const constructorToken = Symbol('MessagesController');
let instance: MessagesController;

export class MessagesController extends BaseController {
  private view: MessagesView;

  constructor(token: symbol) {
    super();

    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    this.view = new MessagesView(
      config.TILE_SIZE * config.ROWS,
      config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
    );

    instance = this;
  }

  public static getInstance(): MessagesController {
    if (instance) {
      return instance;
    }
    return new MessagesController(constructorToken);
  }

  /**
   * Method responsible for changing size of info screen.
   * @param   newWidth        New width of info screen.
   * @param   newHeight       New height of info screen.
   */
  public changeMessageScreenSize(newWidth: number, newHeight: number): void {
    this.view.changeSize(newWidth, newHeight);
  }

  /**
   * Displays given message in view.
   * @param    message     Message to display.
   */
  public showMessageInView(message: string): void {
    if (message) {
      this.view.addMessage(message);
    }
  }

  /**
   * Removes last displayed message.
   */
  public removeLastMessage(): void {
    this.view.removeLastMessage();
  }
}

export const globalMessagesController = MessagesController.getInstance();
