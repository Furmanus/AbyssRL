import { Game } from './game';
import { keyboardKeyToDirectionMap } from './constants/keyboardDirections.constants';
import { applicationConfigService, config } from '../global/config';
import { PlayerActions } from './constants/playerActions.constants';
import {
  IAnyFunction,
  IDirection,
  IMessageData,
} from '../interfaces/common';
import { globalMessagesController } from '../messages/messages.service';
import {
  globalInventoryController,
} from '../global/modal';
import {
  isKeyboardKeyDirection,
  KeyboardWhichDirections,
} from '../interfaces/directions';
import { globalInfoController } from '../info/info.service';
import { globalMiniMapController } from '../minimap/minimap.service';
import { DevFeaturesModal } from '../modal/developmentFeatures/devFeaturesModal';
import { dungeonState } from '../state/application.state';
import type { SerializedDungeonState } from '../state/applicationState.interfaces';
import { KeyboardKeys, KeyCodes } from './constants/keyboardKeys.constants';
import { PlayerEntity } from '../entity/entities/player.entity';
import { aboutGameModalController } from '../modal/aboutGame/aboutGameModal';
import { gameEventBus } from '../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../eventBus/gameEventBus/gameEventBus.constants';
import { entityEventBus } from '../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../eventBus/entityEventBus/entityEventBus.constants';
import { Entity } from '../entity/entities/entity';
import { MonstersTypes } from '../entity/constants/monsters';
import { EntityInventoryActions } from '../inventory/inventory.constants';

const keyCodeToActionMap: Record<number, PlayerActions> = {
  188: PlayerActions.PickUp,
};
const keyCodeToInventoryMode: { [keycode: number]: EntityInventoryActions } = {
  68: EntityInventoryActions.Drop,
  69: EntityInventoryActions.Equip,
  73: EntityInventoryActions.Look,
  85: EntityInventoryActions.Use,
};

export class Main {
  private readonly gameController: Game;
  private readonly devFeaturesModalController: DevFeaturesModal;
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
  constructor(
    tileset: HTMLImageElement,
    serializedGameState?: SerializedDungeonState,
  ) {
    if (serializedGameState) {
      dungeonState.loadDungeonStateFromData(serializedGameState);
    }

    globalInfoController.initialize(tileset);
    this.gameController = new Game(tileset);
    this.devFeaturesModalController = DevFeaturesModal.getInstance();

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

    globalInfoController.changePlayerNameMessageInView(
      this.gameController.getPlayerName(),
    );
    globalInfoController.setPlayerStatsInView(
      this.gameController.getPlayerStats(),
      this.gameController.getPlayerStatsModifiers(),
    );

    this.controllerInitialized = true;
  }

  private bindMethods(): void {
    this.registerKeyPressed = this.registerKeyPressed.bind(this);
    this.registerKeyReleased = this.registerKeyReleased.bind(this);
    this.onResizeWindow = this.onResizeWindow.bind(this);

    this.onShowMessageInView = this.onShowMessageInView.bind(this);
  }

  /**
   * Enables listening on events notified by modal controller.
   */
  private attachModalEvents(): void {
    gameEventBus.subscribe(GameEventBusEventNames.ModalOpen, this.onModalOpen);
    gameEventBus.subscribe(GameEventBusEventNames.ModalClose, this.onModalClose);
  }

  /**
   * Method responsible for attaching keyboard events to window.
   */
  private attachEvents(): void {
    window.addEventListener('keydown', this.registerKeyPressed);
    window.addEventListener('keyup', this.registerKeyReleased);

    this.shiftPressed = false;
    this.controlPressed = false;
    this.altPressed = false;

    if (!this.controllerInitialized) {
      window.addEventListener('resize', this.onResizeWindow);
    }

    entityEventBus.subscribe(EntityEventBusEventNames.EntityDeath, this.onEntityDeath);
    entityEventBus.subscribe(EntityEventBusEventNames.PlayerTurnStart, this.onPlayerTurnStarted);
    gameEventBus.subscribe(GameEventBusEventNames.PlayerMovementConfirmNeeded, this.onPlayerConfirmNeeded);

    if (applicationConfigService.isTestMode) {
      const testElement = document.createElement('div');

      testElement.dataset.test = 'test_element';
      testElement.style.cssText = `
        display: none;
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
        pointer-events: none;
      `;

      document.body.appendChild(testElement);
    }
  }

  /**
   * Method responsible for removing keyboard events from window and listening to object notifying.
   */
  private detachEvents(): void {
    window.removeEventListener('keydown', this.registerKeyPressed);
    window.removeEventListener('keyup', this.registerKeyReleased);

    entityEventBus.unsubscribe(EntityEventBusEventNames.PlayerTurnStart, this.onPlayerTurnStarted);
    gameEventBus.unsubscribe(GameEventBusEventNames.PlayerMovementConfirmNeeded, this.onPlayerConfirmNeeded);
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
    let choosenDirection: IDirection | false;

    if (this.altPressed && this.controlPressed && this.shiftPressed) {
      if (keycode === KeyCodes.OpenDevFeaturesModal) {
        // open test menu
        this.devFeaturesModalController.openModal();
      }
    } else if (this.shiftPressed) {
      if (
        isKeyboardKeyDirection(keycode) &&
        keycode !== KeyCodes.DescendLevel
      ) {
        this.moveCamera(keycode); // shift + numpad direction, move camera around
      } else if (keycode === KeyCodes.AscendLevel) {
        this.gameController.takePlayerAction(PlayerActions.GoUp);
      } else if (keycode === KeyCodes.DescendLevel) {
        this.gameController.takePlayerAction(PlayerActions.GoDown);
      } else if (keycode === KeyCodes.SaveGame) {
        this.saveGame();
      } else if (keycode === KeyCodes.QuitGame) {
        this.quitGame();
      } else if (keycode === KeyCodes.OpenInfoModal) {
        this.openAboutGameModal();
      }
    } else if (this.controlPressed) {
      // placeholder
    } else if (this.altPressed) {
      // placeholder
    } else {
      if (isKeyboardKeyDirection(keycode)) {
        this.gameController.takePlayerAction(
          PlayerActions.Move,
          keyboardKeyToDirectionMap[keycode],
        );
      } else if (keycode === KeyCodes.Activate) {
        // ACTIVATE COMMAND
        globalMessagesController.showMessageInView(
          'Activate object in which direction [1234567890]:',
        );

        choosenDirection = await this.getPlayerConfirmationDirection();

        if (choosenDirection) {
          this.gameController.takePlayerAction(
            PlayerActions.ActivateObject,
            choosenDirection,
          );
        } else {
          globalMessagesController.showMessageInView('You abort your attempt.');
        }
      } else if (keycode === KeyCodes.Examine) {
        // EXAMINE OR LOOK COMMAND
        this.enableExamineMode();
      } else if (keyCodeToInventoryMode[keycode]) {
        this.openPlayerInventory(keyCodeToInventoryMode[keycode]);
      } else if (keyCodeToActionMap[keycode]) {
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
  private moveCamera(keycode: KeyboardWhichDirections): void {
    const deltaX = keyboardKeyToDirectionMap[keycode].x * 4;
    const deltaY = keyboardKeyToDirectionMap[keycode].y * 4;

    this.gameController.moveCameraInView(deltaX, deltaY);
  }

  private onModalOpen = (): void => {
    this.detachEvents();
  };

  private onModalClose = (): void => {
    this.attachEvents();
  };

  private onEntityDeath = (entity: Entity): void => {
    if (entity.getModel().type === MonstersTypes.Player) {
      this.setPlayerStats();
      this.detachEvents();
    }
  }

  private onPlayerTurnStarted = (): void => {
    this.setPlayerStats();
  }

  /**
   * Takes actual player stats from game controller and sets them in info view.
   */
  private setPlayerStats(): void {
    globalInfoController.setPlayerStatsInView(
      this.gameController.getPlayerStats(),
      this.gameController.getPlayerStatsModifiers(),
    );
  }

  /**
   * Method triggered after pressing 'x' key. Prepares game controller to examine visible cells.
   */
  private enableExamineMode(): void {
    globalMessagesController.showMessageInView('Look at...(pick direction):');
    this.gameController.enableExamineMode();
    this.examineMode = true;

    this.attachTemporaryEventListener(this.examinedModeEventListenerCallback);
  }

  /**
   * Opens player directory. Method opens globalInventoryController and waits for result of user selection of inventory items. Then based on mode
   * triggers appriopriate action from player.
   *
   * @param {EntityInventoryActions} mode - Mode in which inventory is opened (pick up, drop, equip)
   */
  private async openPlayerInventory(mode: EntityInventoryActions): Promise<void> {
    const playerModel = this.gameController.getPlayerModel();
    const { inventory } = playerModel;

    const chosenItems = await globalInventoryController.openModal(inventory, mode, playerModel).waitForPlayerSelection();

    if (chosenItems) {
      const { action, selectedItems } = chosenItems;

      if (selectedItems.size) {
        switch (action) {
          case EntityInventoryActions.PickUp:
            PlayerEntity.getInstance().pickUpItems(selectedItems.get());
            globalInventoryController.closeModal();
            break;
          case EntityInventoryActions.Drop:
            PlayerEntity.getInstance().dropItems(selectedItems.get());
            globalInventoryController.closeModal();
            break;
          case EntityInventoryActions.Equip:
            PlayerEntity.getInstance().equipItem(selectedItems.getFirstItem());
            globalInventoryController.closeModal();
            break;
        }
      }
    } else {
      globalInventoryController.closeModal();
    }
  }

  /**
   * Callback for temporary keydown event listener in examine mode.
   *
   * @param e Keyboard event object
   */
  private examinedModeEventListenerCallback = (e: KeyboardEvent): void => {
    if (e.which === 27) {
      this.examineMode = false;
      this.gameController.disableExamineMode();
      this.attachEvents();
      window.removeEventListener(
        'keydown',
        this.examinedModeEventListenerCallback,
      );

      globalInfoController.hideCellInformation();
      globalMessagesController.removeLastMessage();
    } else if (isKeyboardKeyDirection(e.which)) {
      const nextExaminedCell = this.gameController.examineCellInDirection(
        keyboardKeyToDirectionMap[e.which],
      );

      globalInfoController.hideCellInformation();
      globalInfoController.displayCellInformation(nextExaminedCell);
    }
  }

  private openAboutGameModal = (): void => {
    aboutGameModalController.openModal();
  };

  /**
   * Function responsible for resizing game window size and all other canvas/divs(messages, info and map) whenever
   * browser window is resized. Game window should be always about 2/3 and 3/4 of window width/height.
   */
  private onResizeWindow(): void {
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;
    // we calculate new game window size. Game window should be approximately 3/4 of view size
    let x = Math.floor((windowInnerWidth * 2) / 3);
    let y = Math.floor((windowInnerHeight * 3) / 4);

    // we make sure that new game window size dimensions are multiplication of tile size
    x = x - (x % config.TILE_SIZE);
    y = y - (y % config.TILE_SIZE);

    this.gameController.changeGameScreenInView(x, y);
    globalInfoController.changeInfoScreenSize(windowInnerWidth - x - 30, y);
    globalMessagesController.changeMessageScreenSize(
      x,
      windowInnerHeight - y - 40,
    );
    globalMiniMapController.changeMinimapSize(
      windowInnerWidth - x - 30,
      windowInnerHeight - y - 40,
    );
  }

  /**
   * Method triggered after game controller notifies that message has to be shown in messages view.
   *
   * @param   data     Message to display.
   */
  private onShowMessageInView(data: IMessageData): void {
    globalMessagesController.showMessageInView(data.message);
  }

  /**
   * Method triggered after game controller notifies about needed certain action confirmation from player.
   *
   * @param   message    Confirmation message to display.
   * @param   confirm    Function triggered after player confirms move.
   * @param   decline    Function triggered after player declines move.
   */
  private onPlayerConfirmNeeded = (message: string, confirm: () => void, decline: () => void): void => {
    const attachEventsFunction = this.attachEvents.bind(this);

    this.detachEvents();

    globalMessagesController.showMessageInView(message);
    window.addEventListener('keydown', userActionConfirmEventListener);

    function userActionConfirmEventListener(e: KeyboardEvent): void {
      e.preventDefault();

      if (e.which === 89) {
        confirm();

        window.removeEventListener('keydown', userActionConfirmEventListener);
        attachEventsFunction();
      } else if (e.which === 78 || e.which === 32 || e.which === 27) {
        decline();

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
  private getPlayerConfirmationDirection(): Promise<IDirection | false> {
    const extendedKeyboardDirection = Object.assign(
      {},
      keyboardKeyToDirectionMap,
      {
        101: { x: 0, y: 0 },
      },
    );
    const that: this = this;

    this.detachEvents();

    return new Promise<IDirection | false>((resolve) => {
      window.addEventListener(
        'keydown',
        userActionConfirmDirectionEventListener,
      );

      function userActionConfirmDirectionEventListener(e: KeyboardEvent): void {
        const keycode = e.which;
        const directionObject: IDirection =
          extendedKeyboardDirection[keycode as KeyboardWhichDirections];

        if (directionObject) {
          resolve(directionObject);
          window.removeEventListener(
            'keydown',
            userActionConfirmDirectionEventListener,
          );
          that.attachEvents();
        } else if (keycode === 27 || keycode === 32) {
          resolve(false);
          window.removeEventListener(
            'keydown',
            userActionConfirmDirectionEventListener,
          );
          that.attachEvents();
        }
      }
    });
  }

  private attachTemporaryEventListener(callback: IAnyFunction): void {
    this.detachEvents();

    window.addEventListener('keydown', callback);
  }

  private async saveGame(): Promise<void> {
    const key = await this.waitForUserInput(
      [KeyboardKeys.n, KeyboardKeys.y, KeyboardKeys.Esc, KeyboardKeys.Space],
      'Do you want to save game? (y/n)',
    );

    if (key === KeyboardKeys.y) {
      const serializedGameState = JSON.stringify(dungeonState.serialize());

      try {
        await fetch('/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: serializedGameState,
        });
      } catch {
        globalMessagesController.showMessageInView('Failed to save game.');
      }

      globalMessagesController.showMessageInView('Game saved!');
    } else {
      globalMessagesController.removeLastMessage();
    }
  }

  private async quitGame(): Promise<void> {
    const key = await this.waitForUserInput(
      [KeyboardKeys.Wildcard, KeyboardKeys.CapitalY],
      'Do you want to quit game? (Y/n)',
    );

    if (key === KeyboardKeys.CapitalY) {
      try {
        await fetch('/save', {
          method: 'DELETE',
        });

        globalMessagesController.showMessageInView(
          `${
            PlayerEntity.getInstance().getModel().description
          } committed suicide...`,
        );

        window.setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch {
        globalMessagesController.showMessageInView(
          'Failed to delete saved game.',
        );
      }
    } else {
      globalMessagesController.showMessageInView(
        'You decide to continue on your quest.',
      );
    }
  }

  private waitForUserInput(
    allowedKeys: KeyboardKeys[],
    message?: string,
  ): Promise<KeyboardKeys> {
    this.detachEvents();

    globalMessagesController.showMessageInView(message);

    return new Promise((resolve) => {
      const listener = (e: KeyboardEvent) => {
        const key = e.key as KeyboardKeys;
        const isMetaKey = [
          KeyboardKeys.Shift,
          KeyboardKeys.Alt,
          KeyboardKeys.Command,
          KeyboardKeys.Ctrl,
        ].includes(key);

        if (isMetaKey) {
          return;
        }

        if (
          allowedKeys.includes(key) ||
          allowedKeys.includes(KeyboardKeys.Wildcard)
        ) {
          resolve(key);
          window.removeEventListener('keydown', listener);
          this.attachEvents();
        }
      };

      window.addEventListener('keydown', listener);
    });
  }
}
