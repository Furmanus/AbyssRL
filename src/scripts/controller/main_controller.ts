/**
 * Main controller. Responsible for taking user keyboard input, processing it, and triggering appriopiate methods from
 * other sub controllers. Also responsible for managing all sub controllers.
 */
import { GameController } from './game_controller';
import { InfoController } from './info_controller';
import { MiniMapController } from './minimap_controller';
import { MessagesController } from './messages_controller';
import { KEYBOARD_DIRECTIONS } from '../constants/keyboard_directions';
import { config } from '../global/config';
import {
  PLAYER_ACTION_ACTIVATE_OBJECT,
  PLAYER_ACTION_GO_DOWN,
  PLAYER_ACTION_GO_UP,
  PLAYER_ACTION_MOVE_PLAYER,
  PLAYER_DEATH,
  PLAYER_WALK_CONFIRM_NEEDED,
  PlayerActions,
  SHOW_MESSAGE_IN_VIEW,
  START_PLAYER_TURN,
} from '../constants/player_actions';
import {
  IAnyFunction,
  IDirection,
  IMessageData,
  IPlayerConfirmationObject,
} from '../interfaces/common';
import { Controller } from './controller';
import { DungeonEvents } from '../constants/dungeon_events';
import { boundMethod } from 'autobind-decorator';
import { ILevelInfo } from '../interfaces/level';
import {
  EXAMINE_CELL,
  ModalActions,
  STOP_EXAMINE_CELL,
} from '../constants/game_actions';
import { Cell } from '../model/dungeon/cells/cell_model';
import { globalMessagesController } from '../global/messages';
import { ItemsCollection } from '../collections/items_collection';
import { globalInventoryController } from '../global/modal';
import { EntityInventoryActions, InventoryModalEvents } from '../constants/entity_events';

const keyCodeToActionMap: {[keycode: number]: string} = {
  188: PlayerActions.PICK_UP,
};
const keyCodeToInventoryMode: {[keycode: number]: EntityInventoryActions} = {
  68: EntityInventoryActions.DROP,
  69: EntityInventoryActions.EQUIP,
  73: EntityInventoryActions.LOOK,
  85: EntityInventoryActions.USE,
};

export class MainController extends Controller {
    private readonly gameController: GameController;
    private readonly infoController: InfoController;
    private readonly miniMapController: MiniMapController;
    private readonly messagesController: MessagesController;
    private shiftPressed: boolean;
    private controlPressed: boolean;
    private altPressed: boolean;
    private controllerInitialized: boolean;
    /**
     * Game screen is in examine mode: player can only look around and examine cells.
     */
    private examineMode: boolean;
    /**
     * Constructor of main application controller.
     * @param  tileset  HTML Img element with tiles to draw.
     */
    constructor(tileset: HTMLImageElement) {
      super();

      this.gameController = new GameController(tileset);
      this.infoController = new InfoController(tileset);
      this.miniMapController = new MiniMapController();
      this.messagesController = globalMessagesController;

      this.shiftPressed = false;
      this.controlPressed = false;
      this.altPressed = false;

      this.controllerInitialized = false;

      this.initialize();
    }

    /**
     * Method responsible for initialization of main controller.
     */
    protected initialize(): void {
      this.bindMethods();
      this.attachEvents();
      this.attachModalEvents();
      /**
         * This two events are attached in initialize, because they has to be active when other events are detached during
         * examine mode.
         */
      this.gameController.on(this, EXAMINE_CELL, this.onExamineCell);
      this.gameController.on(this, STOP_EXAMINE_CELL, this.onStopExamineCell);
      this.gameController.on(this, PlayerActions.PICK_UP, this.onGameControllerPlayerPickUp);

      this.infoController.changePlayerNameMessageInView(this.gameController.getPlayerName());
      this.infoController.setPlayerStatsInView(this.gameController.getPlayerStats());

      this.controllerInitialized = true;
    }

    /**
     * Method responsible for binding methods to main controller object. Methods has to be bound here, because in
     * certain circumstances event listeners to which those function are callbacks are removed from appriopiate objects.
     * TODO refactor to use boundMethod decorator and remove this method
     */
    private bindMethods(): void {
      this.registerKeyPressed = this.registerKeyPressed.bind(this);
      this.registerKeyReleased = this.registerKeyReleased.bind(this);
      this.onResizeWindow = this.onResizeWindow.bind(this);

      this.onShowMessageInView = this.onShowMessageInView.bind(this);
      this.onPlayerConfirmNeeded = this.onPlayerConfirmNeeded.bind(this);
    }

    /**
     * Enables listening on events notified by modal controller.
     */
    private attachModalEvents(): void {
      globalInventoryController.on(this, ModalActions.OPEN_MODAL, this.onModalOpen);
      globalInventoryController.on(this, InventoryModalEvents.INVENTORY_MODAL_CLOSED, this.onInventoryModalClose);
    }

    /**
     * Method responsible for attaching keyboard events to window.
     */
    private attachEvents(): void {
      window.addEventListener('keydown', this.registerKeyPressed);
      window.addEventListener('keyup', this.registerKeyReleased);

      if (!this.controllerInitialized) {
        window.addEventListener('resize', this.onResizeWindow);
      }

      this.gameController.on(this, SHOW_MESSAGE_IN_VIEW, this.onShowMessageInView);
      this.gameController.on(this, PLAYER_WALK_CONFIRM_NEEDED, this.onPlayerConfirmNeeded);
      this.gameController.on(this, DungeonEvents.CHANGE_CURRENT_LEVEL, this.onChangeDungeonLevel);
      this.gameController.on(this, START_PLAYER_TURN, this.onPlayerTurnStarted);
      this.gameController.on(this, PLAYER_DEATH, this.onPlayerDeath);
    }

    /**
     * Method responsible for removing keyboard events from window and listening to object notifying.
     */
    private detachEvents(): void {
      window.removeEventListener('keydown', this.registerKeyPressed);
      window.removeEventListener('keyup', this.registerKeyReleased);

      this.gameController.off(this, SHOW_MESSAGE_IN_VIEW);
      this.gameController.off(this, PLAYER_WALK_CONFIRM_NEEDED);
      this.gameController.off(this, DungeonEvents.CHANGE_CURRENT_LEVEL);
      this.gameController.off(this, START_PLAYER_TURN);
    }

    /**
     * Method responsible for registering user keyboard input and triggering {@code takeAction} method. Method checks
     * whether key pressed is either shift, alt or control. If it is, it modify appriopiate flag. Otherwise it takes
     * key keycode and passes it to {@code takeAction} method.
     *
     * @param   e   Event which triggered this method.
     */
    private registerKeyPressed(e: KeyboardEvent): void {
      e.preventDefault();

      if (e.which === 16) {
        this.shiftPressed = true;
      } else if (e.which === 17) {
        this.controlPressed = true;
      } else if (e.which === 18) {
        this.altPressed = true;
      } else {
        this.takeAction(e.which);
      }
    }

    /**
     * Method responsible for registering user releasing key pressed. Changes boolean flag if key pressed was either
     * shift, alt or control.
     *
     * @param   e   Event which triggered this method.
     */
    private registerKeyReleased(e: KeyboardEvent): void {
      e.preventDefault();

      if (e.which === 16) {
        this.shiftPressed = false;
      } else if (e.which === 17) {
        this.controlPressed = false;
      } else if (e.which === 18) {
        this.altPressed = false;
      }
    }

    /**
     * Method responsible for triggering appriopiate method in response for user input.
     *
     * @param   keycode   Pressed by user key keycode
     */
    private async takeAction(keycode: number): Promise<void> {
      let choosenDirection: IDirection|false;
      if (this.shiftPressed) {
        if (KEYBOARD_DIRECTIONS[keycode] && keycode !== 190) {
          this.moveCamera(keycode); // shift + numpad direction, move camera around
        } else if (keycode === 188) {
          this.gameController.takePlayerAction(PLAYER_ACTION_GO_UP);
        } else if (keycode === 190) {
          this.gameController.takePlayerAction(PLAYER_ACTION_GO_DOWN);
        }
      } else if (this.controlPressed) {
        // placeholder
      } else if (this.altPressed) {
        // placeholder
      } else {
        if (KEYBOARD_DIRECTIONS[keycode]) {
          this.gameController.takePlayerAction(PLAYER_ACTION_MOVE_PLAYER, KEYBOARD_DIRECTIONS[keycode]);
        } else if (keycode === 65) {
          // ACTIVATE COMMAND
          this.messagesController.showMessageInView('Activate object in which direction [1234567890]:');

          choosenDirection = await this.getPlayerConfirmationDirection();

          if (choosenDirection) {
            this.gameController.takePlayerAction(PLAYER_ACTION_ACTIVATE_OBJECT, choosenDirection);
          } else {
            this.messagesController.showMessageInView('You abort your attempt.');
          }
        } else if (keycode === 88) {
          // EXAMINE OR LOOK COMMAND
          this.enableExamineMode();
        } else if (keyCodeToInventoryMode[keycode]) {
          this.openInventory(keyCodeToInventoryMode[keycode]);
        } else {
          this.gameController.takePlayerAction(keyCodeToActionMap[keycode]);
        }
      }
    }

    /**
     * Method responsible for moving camera in view.
     *
     * @param   keycode     Keycode of key pressed by user. Method accepts only arror keys or numpad keys
     *                      (with exception of '5').
     */
    private moveCamera(keycode: number): void {
      const deltaX = KEYBOARD_DIRECTIONS[keycode].x * 4;
      const deltaY = KEYBOARD_DIRECTIONS[keycode].y * 4;

      this.gameController.moveCameraInView(deltaX, deltaY);
    }

    @boundMethod
    private onModalOpen(): void {
      this.detachEvents();
    }

    @boundMethod
    private onModalClose(): void {
      this.attachEvents();
    }

    /**
     * Method triggered after game controller notifies about player death.
     */
    @boundMethod
    private onPlayerDeath(): void {
      this.setPlayerStats();
      this.detachEvents();
    }

    /**
     * Method triggered after game controller emits event about level change by player.
     *
     * @param data  Data object passed along with event
     */
    @boundMethod
    private onChangeDungeonLevel(data: ILevelInfo): void {
      this.infoController.changeLevelInfoMessage(data);
    }

    /**
     * Method called when game controller notifies that player attempts to pick up items when there are multiple items
     * on ground.
     *
     * @param cellItems    Collection of items from cell where player is
     */
    @boundMethod
    private onGameControllerPlayerPickUp(cellItems: ItemsCollection): void {
      this.openInventory(EntityInventoryActions.PICK_UP, cellItems);
    }

    /**
     * Method triggered after notification from game controller about examination of certain cell.
     *
     * @param cell  Cell which is examined by player
     */
    @boundMethod
    private onExamineCell(cell: Cell): void {
      /**
         * Clear drawn information about previous cell
         */
      this.infoController.hideCellInformation();
      this.infoController.displayCellInformation(cell);
    }

    /**
     * Method triggered after players stops examining dungeon cells.
     */
    @boundMethod
    private onStopExamineCell(): void {
      this.infoController.hideCellInformation();
      this.messagesController.removeLastMessage();
    }

    /**
     * Method triggered after game controller emits event about start of player turn.
     */
    @boundMethod
    private onPlayerTurnStarted(): void {
      this.setPlayerStats();
    }

    /**
     * Takes actual player stats from game controller and sets them in info view.
     */
    private setPlayerStats(): void {
      this.infoController.setPlayerStatsInView(this.gameController.getPlayerStats());
    }

    /**
     * Method triggered after pressing 'x' key. Prepares game controller to examine visible cells.
     */
    @boundMethod
    private enableExamineMode(): void {
      this.messagesController.showMessageInView('Look at...(pick direction):');
      this.gameController.enableExamineMode();
      this.examineMode = true;

      this.attachTemporaryEventListener(this.examinedModeEventListenerCallback);
    }

    /**
     * Opens player directory
     */
    private openInventory(mode?: EntityInventoryActions, items?: ItemsCollection): void {
      const playerInventory: ItemsCollection = this.gameController.getPlayerInventory();

      globalInventoryController.openModal(items || playerInventory, mode);
      this.attachTemporaryEventListener(this.inventoryModeEventListenerCallback);
    }

    /**
     * Callback for temporary keydown event listener in examine mode.
     *
     * @param e Keyboard event object
     */
    @boundMethod
    private examinedModeEventListenerCallback(e: KeyboardEvent): void {
      if (e.which === 27) {
        this.examineMode = false;
        this.gameController.disableExamineMode();
        this.attachEvents();
        window.removeEventListener('keydown', this.examinedModeEventListenerCallback);
      } else if (KEYBOARD_DIRECTIONS[e.which]) {
        this.gameController.examineCellInDirection(KEYBOARD_DIRECTIONS[e.which]);
      }
    }

    /**
     * Callback for keydown event in inventory mode.
     *
     * @param e  Native keyboard event
     */
    @boundMethod
    private inventoryModeEventListenerCallback(e: KeyboardEvent): void {
      if (e.which === 27) {
        globalInventoryController.closeModal();
      }
    }

    /**
     * Callback method triggered after inventory modal is being closed. Attaches back main event listeners.
     */
    @boundMethod
    private onInventoryModalClose(): void {
      this.attachEvents();
      window.removeEventListener('keydown', this.inventoryModeEventListenerCallback);
    }

    /**
     * Function responsible for resizing game window size and all other canvas/divs(messages, info and map) whenever
     * browser window is resized. Game window should be always about 2/3 and 3/4 of window width/height.
     */
    private onResizeWindow(): void {
      const windowInnerWidth = window.innerWidth;
      const windowInnerHeight = window.innerHeight;
      // we calculate new game window size. Game window should be approximately 3/4 of view size
      let x = Math.floor(windowInnerWidth * 2 / 3);
      let y = Math.floor(windowInnerHeight * 3 / 4);

      // we make sure that new game window size dimensions are multiplication of tile size
      x = x - (x % config.TILE_SIZE);
      y = y - (y % config.TILE_SIZE);

      this.gameController.changeGameScreenInView(x, y);
      this.infoController.changeInfoScreenSize(windowInnerWidth - x - 30, y);
      this.messagesController.changeMessageScreenSize(x, windowInnerHeight - y - 40);
      this.miniMapController.changeMinimapSize(windowInnerWidth - x - 30, windowInnerHeight - y - 40);
    }

    /**
     * Method triggered after game controller notifies that message has to be shown in messages view.
     *
     * @param   data     Message to display.
     */
    private onShowMessageInView(data: IMessageData): void {
      this.messagesController.showMessageInView(data.message);
    }

    /**
     * Method triggered after game controller notifies about needed certain action confirmation from player.
     * @param   data            Object with data about confirmation.
     * @param   data.message    Confirmation message to display.
     * @param   data.confirm    Function triggered after player confirms move.
     * @param   data.decline    Function triggered after player declines move.
     */
    private onPlayerConfirmNeeded(data: IPlayerConfirmationObject): void {
      const attachEventsFunction = this.attachEvents.bind(this);

      this.detachEvents();

      this.messagesController.showMessageInView(data.message);
      window.addEventListener('keydown', userActionConfirmEventListener);

      function userActionConfirmEventListener(e: KeyboardEvent): void {
        e.preventDefault();

        if (e.which === 89) {
          data.confirm();

          window.removeEventListener('keydown', userActionConfirmEventListener);
          attachEventsFunction();
        } else if (e.which === 78 || e.which === 32 || e.which === 27) {
          data.decline();

          window.removeEventListener('keydown', userActionConfirmEventListener);
          attachEventsFunction();
        }
      }
    }

    /**
     * Function responsible for obtaining from player direction of next action.
     *
     * @returns   Returns promise which resolves to direction object or false, if confirmation was rejected
     */
    private getPlayerConfirmationDirection(): Promise<IDirection|false> {
      const extendedKeyboardDirection = Object.assign({}, KEYBOARD_DIRECTIONS, {
        101: { x: 0, y: 0 },
      });
      const that: this = this;

      this.detachEvents();

      return new Promise<IDirection|false>((resolve) => {
        window.addEventListener('keydown', userActionConfirmDirectionEventListener);

        function userActionConfirmDirectionEventListener(e: KeyboardEvent): void {
          const keycode: number = e.which;
          const directionObject: IDirection = extendedKeyboardDirection[keycode];

          if (directionObject) {
            resolve(directionObject);
            window.removeEventListener('keydown', userActionConfirmDirectionEventListener);
            that.attachEvents();
          } else if (keycode === 27 || keycode === 32) {
            resolve(false);
            window.removeEventListener('keydown', userActionConfirmDirectionEventListener);
            that.attachEvents();
          }
        }
      });
    }

    private attachTemporaryEventListener(callback: IAnyFunction): void {
      this.detachEvents();

      window.addEventListener('keydown', callback);
    }
}
