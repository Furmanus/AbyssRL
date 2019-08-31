import {EntityController} from './entity_controller';
import * as Utility from '../../helper/utility';
import {config} from '../../global/config';
import {
    END_PLAYER_TURN,
    PLAYER_WALK_CONFIRM_NEEDED,
    PlayerActions,
    START_PLAYER_TURN,
} from '../../constants/player_actions';
import {PlayerModel} from '../../model/entity/player_model';
import {globalMessagesController} from '../../global/messages';
import {IAnyFunction, IAnyObject} from '../../interfaces/common';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {UseAttemptResult} from '../../model/dungeon/cells/effects/use_attempt_result';
import {UseEffectResult} from '../../model/dungeon/cells/effects/use_effect_result';
import {LevelModel} from '../../model/dungeon/level_model';
import {DungeonEvents} from '../../constants/dungeon_events';
import {ICombatResult} from '../../helper/combat_helper';
import {ItemsCollection} from '../../collections/items_collection';
import {MessagesController} from '../messages_controller';
import {ItemModel} from '../../model/items/item_model';
import {InventoryController} from '../inventory_controller';
import {globalInventoryController} from '../../global/modal';
import {EntityInventoryActions, InventoryModalEvents} from '../../constants/entity_events';
import {boundMethod} from 'autobind-decorator';

export interface IMoveResolve {
    canMove: boolean;
    message: string;
}
interface IInventoryActionConfirmData {
    action: EntityInventoryActions;
    selectedItems: ItemModel[];
}

export class PlayerController extends EntityController<PlayerModel> {
    private globalMessageController: MessagesController = globalMessagesController;
    private globalInventoryController: InventoryController = globalInventoryController;

    constructor(constructorConfig: IAnyObject) {
        super(constructorConfig);

        this.model = new PlayerModel(constructorConfig);
        this.attachEvents();
    }
    protected attachEvents(): void {
        super.attachEvents();

        this.model.on(this, 'property:level:change', (newLevelModel: LevelModel) => {
            this.notify(DungeonEvents.CHANGE_CURRENT_LEVEL, {
                branch: newLevelModel.branch,
                levelNumber: newLevelModel.levelNumber,
            });
        });
        this.globalInventoryController.on(this, InventoryModalEvents.INVENTORY_ACTION_CONFIRMED, this.onInventoryActionConfirmed);
    }
    @boundMethod
    private onInventoryActionConfirmed(data: IInventoryActionConfirmData): void {
        const {
            action,
            selectedItems,
        } = data;

        if (!selectedItems.length) {
            this.globalInventoryController.closeModal();
            return;
        }

        if (action === EntityInventoryActions.DROP) {
            this.dropItems(selectedItems);
            this.globalInventoryController.closeModal();
        } else if (action === EntityInventoryActions.PICK_UP) {
            this.pickUpItems(selectedItems);
            this.globalInventoryController.closeModal();
        }
    }
    public dropItems(items: ItemModel[]): void {
        super.dropItems(items);

        this.notify(PlayerActions.END_PLAYER_TURN);
    }
    /**
     * Method triggered at beginning of each player turn.
     */
    public act(): void {
        this.notify(START_PLAYER_TURN);
    }
    /**
     * Method responsible for attempting to move player into target cell. A little bit magic happens here: function
     * returns a promise. If movement is instantly possible or not possible, promise is resolved immediately. If
     * confirmation from player is needed, game controller is notified about that. Along with notification, two
     * functions are passed. First is callback function triggered when player confirms movement, second is triggered
     * when player rejects movement attempt. Both those functions inside calls promise resolve function.
     *
     * @param       newCell     New target cell object.
     * @returns                 Returns promise. Resolved promise returns object with data with information whether
     *                          move is allowed and movement message.
     */
    public move(newCell: Cell): Promise<IMoveResolve> {
        const {
            x,
            y,
        } = newCell;
        const playerController = this;
        /**
         * Move function from entity class bound to this player controller instance.
         */
        const entityMoveFunction = super.move.bind(this);
        const playerModel = this.model;

        if (x < 0 || y < 0 || x > config.LEVEL_WIDTH - 1 || y > config.LEVEL_HEIGHT - 1) {
            throw new Error('Entity moved beyond level grid');
        }

        return new Promise((resolve) => {
            if (newCell.blockMovement) {
                playerController.moveAttempt(newCell, resolve);
            } else if (newCell.confirmMovement) {
                if (newCell.type === playerModel.position.type) {
                    playerController.moveAttempt(newCell, resolve);
                } else {
                    /**
                     * Magic part: promise is not resolved here, instead game controller is notified about needed
                     * movement confirmation from player. Along with notification object two functions are passed. One
                     * function is called after player confirms movement, other when player rejects. Both function
                     * calls promise resolve.
                     */
                    playerController.notify(PLAYER_WALK_CONFIRM_NEEDED, {
                        message: `Do you really want to walk into ${newCell.description}? (y/n)`,
                        confirm: () => {
                            playerController.moveAttempt(newCell, resolve);
                        },
                        decline: () => {
                            resolve({
                                canMove: false,
                                message: 'You abort your attempt.',
                            });
                        },
                    });
                }
            } else {
                playerController.moveAttempt(newCell, resolve);
            }
        });
    }
    /**
     * Method responsible for attempt to activate certain cell.
     *
     * @param   cell    Cell model which player is trying to activate
     */
    public activate(cell: Cell): void {
        /**
         * In first step, attempt to use cell is made. Method returns useAttemptResult object, which describes
         * effect and result of attempt (is attempt was successful, message to display and if attempt should end
         * player turn.
         */
        const useAttemptResult: UseAttemptResult = cell.useAttempt(this);
        let useEffect: UseEffectResult;

        globalMessagesController.showMessageInView(useAttemptResult.message);
        if (useAttemptResult.canUse) {
            /**
             * If attempt was successful, player entity uses target cell.
             */
            useEffect = cell.useEffect(this);

            globalMessagesController.showMessageInView(useEffect.message);
            if (useEffect.endTurn) {
                this.notify(END_PLAYER_TURN);
            }
        } else {
            if (useAttemptResult.endTurn) {
                this.notify(END_PLAYER_TURN);
            }
        }
    }
    /**
     * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
     */
    public pickUp(): void {
        const currentCellInventory: ItemsCollection = this.model.getCurrentCellInventory();

        if (currentCellInventory.size === 0) {
            globalMessagesController.showMessageInView('What do you want to pick up?');
        } else if (currentCellInventory.size === 1) {
            this.model.pickUp(currentCellInventory.getFirstItem());
        } else {
            /*Notify to open inventory modal*/
            this.notify(PlayerActions.PICK_UP, currentCellInventory);
        }
    }
    /**
     * Picks up items from given collection. For every items from collection pickUp method from model is called.
     *
     * @param items     Collection of items to pick up.
     */
    public pickUpItems(items: ItemModel[]): void {
        items.forEach((item: ItemModel) => {
            this.model.pickUp(item);
        });
    }
    public onEntityPickUp(item: ItemModel): void {
        super.onEntityPickUp(item);

        this.notify(PlayerActions.END_PLAYER_TURN);
    }
    /**
     * Function called when move attempt by player was successful. Called inside of move function.
     *
     * @param   cellModel                   Cell model where player moves
     * @param   promiseResolveFunction      Resolve function from promise returned by move method
     */
    public moveAttempt(cellModel: Cell, promiseResolveFunction: IAnyFunction): void {
        const entityMoveFunction = super.move.bind(this);
        const walkAttemptCellResult = cellModel.walkAttempt(this);
        const canPlayerMove = walkAttemptCellResult.canMove;
        const newCellBlocksMovement = cellModel.blockMovement;
        let moveAttemptMessage = walkAttemptCellResult.message;

        if (newCellBlocksMovement) {
            promiseResolveFunction({
                canMove: false,
                message: `${Utility.capitalizeString(cellModel.description)} is blocking your way.`,
            });
            return;
        }
        if (cellModel.entity && cellModel.entity.type !== 'player') {
            if (cellModel.entity.isHostile) {
                const attackResult: ICombatResult = this.attack(cellModel.entity);

                this.notify(END_PLAYER_TURN);

                promiseResolveFunction({
                    canMove: false,
                    message: attackResult.message,
                });
            } else {
                promiseResolveFunction({
                    canMove: false,
                    message: `${Utility.capitalizeString(cellModel.entity.description)} is in your way.`,
                });
            }
            return;
        }

        if (canPlayerMove) {
            entityMoveFunction(cellModel);

            if (cellModel.walkMessage) {
                moveAttemptMessage = cellModel.walkMessage;
            }
        }

        this.notify(END_PLAYER_TURN); // player successfully moved, so we notify game controller to end turn
        promiseResolveFunction({
            canMove: canPlayerMove,
            message: moveAttemptMessage,
        });
    }
    /**
     * Returns player field of view.
     */
    public getPlayerFov(): Cell[] {
        return this.model.fov;
    }
    /**
     * Returns player name.
     */
    public getName(): string {
        return this.model.description;
    }
    /**
     * Returns player inventory.
     * @returns Player inventory (ItemCollection)
     */
    public getPlayerInventory(): ItemsCollection {
        return this.model.inventory;
    }
}
